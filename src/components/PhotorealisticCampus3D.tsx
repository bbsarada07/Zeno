import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import campusData from '../data/campusData.json';
import type { DijkstraResult } from '../services/dijkstraRouter';

interface PhotorealisticCampus3DProps {
  selectedLocationId: string | null;
  onSelectBuilding: (buildingId: string) => void;
  routeResult: DijkstraResult | null;
  is3DMode: boolean;
  accessibilityMode?: boolean;
}

// Convert Geo GPS [lon, lat] relative to Campus Center to 3D World (X, Z) Coordinates
const CENTER_LON = campusData.campusInfo.centerCoordinates[0];
const CENTER_LAT = campusData.campusInfo.centerCoordinates[1];
const SCALE_X = 12000;
const SCALE_Z = 12000;

function gpsTo3D(lon: number, lat: number): { x: number; z: number } {
  const x = (lon - CENTER_LON) * SCALE_X;
  const z = (CENTER_LAT - lat) * SCALE_Z;
  return { x, z };
}

export const PhotorealisticCampus3D: React.FC<PhotorealisticCampus3DProps> = ({
  selectedLocationId,
  onSelectBuilding,
  routeResult,
  is3DMode,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [loadingModelStatus, setLoadingModelStatus] = useState<string>('Initializing WebGL 3D Scene...');
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  // Three.js References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Object3D>>(new Map());
  const routeLineRef = useRef<THREE.Mesh | null>(null);
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetCamLookRef = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. THREE.JS SCENE CREATION
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0f1d);
    scene.fog = new THREE.FogExp2(0x0a0f1d, 0.002);
    sceneRef.current = scene;

    // 2. GOOGLE EARTH-STYLE PERSPECTIVE CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, 180, 220); // Aerial perspective
    cameraRef.current = camera;

    // 3. WEBGL RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. ORBIT CONTROLS (Google Earth Camera Pan/Rotate/Zoom)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05; // Prevent camera clipping under ground
    controls.minDistance = 20;
    controls.maxDistance = 450;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. PHOTOREALISTIC LIGHTING ENGINE
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xddeeff, 0x112233, 0.5);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfff5ea, 1.4);
    sunLight.position.set(120, 200, 100);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 500;
    const shadowD = 200;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    scene.add(sunLight);

    // 6. TERRAIN & GROUND MATERIALS (Grass, Asphalt, Plaza)
    const groundGeo = new THREE.PlaneGeometry(600, 600);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x1a2e22, // Campus Lush Grass
      roughness: 0.9,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Concrete Plaza Central Base
    const plazaGeo = new THREE.PlaneGeometry(350, 300);
    const plazaMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.6,
    });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.rotation.x = -Math.PI / 2;
    plaza.position.set(0, 0.1, 0);
    plaza.receiveShadow = true;
    scene.add(plaza);

    // Main Campus Asphalt Roads Network
    createCampusRoadNetwork(scene);

    // Landscaping: Trees & Street Lights
    createCampusLandscaping(scene);

    // 7. REAL 3D BUILDING GENERATOR & GLB LOADER ENGINE
    const gltfLoader = new GLTFLoader();
    const buildingMap = new Map<string, THREE.Object3D>();

    campusData.blocks.forEach((block) => {
      const { x, z } = gpsTo3D(block.coordinates[0], block.coordinates[1]);
      const buildingGroup = new THREE.Group();
      buildingGroup.position.set(x, 0, z);

      // Attempt GLB Model Load with Fallback
      const modelPath = `/models/campus/${block.code.toLowerCase()}.glb`;
      gltfLoader.load(
        modelPath,
        (gltf) => {
          const model = gltf.scene;
          model.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          buildingGroup.add(model);
        },
        undefined,
        () => {
          // Architectural Procedural 3D Building Fallback
          const bldgMesh = createProcedural3DBuilding(block);
          buildingGroup.add(bldgMesh);
        }
      );

      // Building UserData for Raycasting
      buildingGroup.userData = { id: block.id, name: block.name, code: block.code };
      scene.add(buildingGroup);
      buildingMap.set(block.id, buildingGroup);
      buildingMap.set(block.name, buildingGroup);
    });

    buildingMeshesRef.current = buildingMap;
    setLoadingModelStatus('3D Campus Digital Twin Loaded');

    // 8. RAYCASTING INTERACTION (CLICK BUILDINGS)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        let parent: THREE.Object3D | null = hit.object;
        while (parent && parent !== scene) {
          if (parent.userData && parent.userData.id) {
            onSelectBuilding(parent.userData.id);
            return;
          }
          parent = parent.parent;
        }
      }
    };

    const handlePointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      let found: string | null = null;
      for (const hit of intersects) {
        let parent: THREE.Object3D | null = hit.object;
        while (parent && parent !== scene) {
          if (parent.userData && parent.userData.name) {
            found = parent.userData.name;
            break;
          }
          parent = parent.parent;
        }
        if (found) break;
      }
      setHoveredBuilding(found);
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);

    // 9. ANIMATION & RENDER LOOP
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Camera FlyTo Interpolation
      if (targetCamPosRef.current && targetCamLookRef.current && controlsRef.current && cameraRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.05);
        controlsRef.current.target.lerp(targetCamLookRef.current, 0.05);
        if (cameraRef.current.position.distanceTo(targetCamPosRef.current) < 0.5) {
          targetCamPosRef.current = null;
          targetCamLookRef.current = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.dispose();
    };
  }, []);

  // CAMERA FLY-TO & BUILDING SELECTION HIGHLIGHT
  useEffect(() => {
    if (!selectedLocationId || !sceneRef.current) return;

    const targetObj = buildingMeshesRef.current.get(selectedLocationId);
    if (targetObj) {
      const targetPos = targetObj.position;
      targetCamLookRef.current = new THREE.Vector3(targetPos.x, 15, targetPos.z);
      targetCamPosRef.current = new THREE.Vector3(targetPos.x, targetPos.y + 70, targetPos.z + 90);
    }
  }, [selectedLocationId]);

  // DYNAMIC 3D DIJKSTRA ROUTE PATH RENDERING
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Remove existing route mesh
    if (routeLineRef.current) {
      scene.remove(routeLineRef.current);
      routeLineRef.current.geometry.dispose();
      routeLineRef.current = null;
    }

    if (!routeResult || !routeResult.pathNodeIds || routeResult.pathNodeIds.length < 2) return;

    // Build 3D Waypoints Curve from Dijkstra Route Nodes
    const waypoints: THREE.Vector3[] = [];
    routeResult.pathNodeIds.forEach((nodeId: string) => {
      const gNode = campusData.graphNodes.find((n) => n.id === nodeId);
      if (gNode) {
        const { x, z } = gpsTo3D(gNode.coordinates[0], gNode.coordinates[1]);
        waypoints.push(new THREE.Vector3(x, 1.2, z));
      }
    });

    if (waypoints.length > 1) {
      const curve = new THREE.CatmullRomCurve3(waypoints);
      const tubeGeo = new THREE.TubeGeometry(curve, 64, 1.8, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: 0x00f0ff,
        emissive: 0x00aaff,
        emissiveIntensity: 0.8,
        roughness: 0.2,
      });
      const routeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(routeMesh);
      routeLineRef.current = routeMesh;
    }
  }, [routeResult]);

  return (
    <div className="w-full h-full relative overflow-hidden select-none bg-[#030712]">
      <div ref={mountRef} className="w-full h-[520px] rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing" />

      {/* Floating Status & Camera Controls Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center space-x-2 font-mono text-xs">
        <span className="px-3 py-1.5 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-cyan-300 font-bold backdrop-blur-md shadow-lg flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{loadingModelStatus}</span>
        </span>

        {hoveredBuilding && (
          <span className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white font-bold backdrop-blur-md shadow-lg">
            🏢 {hoveredBuilding}
          </span>
        )}
      </div>
    </div>
  );
};

// ==================== PROCEDURAL 3D ARCHITECTURAL GENERATOR ====================
function createProcedural3DBuilding(block: any): THREE.Group {
  const group = new THREE.Group();
  const width = block.dimensions.width * 0.45;
  const length = block.dimensions.length * 0.45;
  const height = block.heightMeters * 0.85;

  // Main Concrete Facade Base
  const wallGeo = new THREE.BoxGeometry(width, height, length);
  const wallMat = new THREE.MeshStandardMaterial({
    color: parseInt(block.color.replace('#', '0x')) || 0x1e293b,
    roughness: 0.5,
    metalness: 0.2,
  });
  const walls = new THREE.Mesh(wallGeo, wallMat);
  walls.position.y = height / 2;
  walls.castShadow = true;
  walls.receiveShadow = true;
  group.add(walls);

  // Glass Window Panels Layer
  const windowGeo = new THREE.BoxGeometry(width + 0.4, height * 0.75, length + 0.4);
  const windowMat = new THREE.MeshStandardMaterial({
    color: 0x00f0ff,
    roughness: 0.1,
    metalness: 0.9,
    transparent: true,
    opacity: 0.45,
  });
  const windowPanes = new THREE.Mesh(windowGeo, windowMat);
  windowPanes.position.y = height / 2;
  group.add(windowPanes);

  // Roof Parapet / Skylight Cap
  const roofGeo = new THREE.BoxGeometry(width * 0.85, 2, length * 0.85);
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
  const roof = new THREE.Mesh(roofGeo, roofMat);
  roof.position.y = height + 1;
  roof.castShadow = true;
  group.add(roof);

  // Entrance Portico
  const doorGeo = new THREE.BoxGeometry(width * 0.35, 6, 4);
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.3 });
  const door = new THREE.Mesh(doorGeo, doorMat);
  door.position.set(0, 3, length / 2 + 1);
  group.add(door);

  return group;
}

// ==================== CAMPUS ROADS & INFRASTRUCTURE ====================
function createCampusRoadNetwork(scene: THREE.Scene) {
  const roadMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 });

  // Main South-North Spine Road
  const road1Geo = new THREE.PlaneGeometry(16, 400);
  const road1 = new THREE.Mesh(road1Geo, roadMat);
  road1.rotation.x = -Math.PI / 2;
  road1.position.set(0, 0.15, 0);
  road1.receiveShadow = true;
  scene.add(road1);

  // East-West Central Avenue
  const road2Geo = new THREE.PlaneGeometry(380, 16);
  const road2 = new THREE.Mesh(road2Geo, roadMat);
  road2.rotation.x = -Math.PI / 2;
  road2.position.set(0, 0.15, -20);
  road2.receiveShadow = true;
  scene.add(road2);
}

// ==================== CAMPUS LANDSCAPING (TREES & LIGHTS) ====================
function createCampusLandscaping(scene: THREE.Scene) {
  const trunkGeo = new THREE.CylinderGeometry(0.8, 1.2, 8, 8);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x3d2314 });

  const foliageGeo = new THREE.ConeGeometry(5, 12, 8);
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 });

  // Scatter Trees around campus walkways
  const treePositions = [
    [-60, -40], [60, -40], [-80, 40], [80, 40], [-40, -100], [40, -100], [-100, 100], [100, 100]
  ];

  treePositions.forEach(([x, z]) => {
    const treeGroup = new THREE.Group();
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 4;
    trunk.castShadow = true;
    treeGroup.add(trunk);

    const foliage = new THREE.Mesh(foliageGeo, foliageMat);
    foliage.position.y = 12;
    foliage.castShadow = true;
    treeGroup.add(foliage);

    treeGroup.position.set(x, 0, z);
    scene.add(treeGroup);
  });
}
