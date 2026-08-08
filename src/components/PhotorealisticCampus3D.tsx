import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import campusData from '../data/campusData.json';
import { getCampusLocations } from '../services/dijkstraRouter';
import type { CampusLocation, DijkstraResult } from '../services/dijkstraRouter';

interface PhotorealisticCampus3DProps {
  selectedLocationId: string | null;
  sourceLocationId: string;
  onSelectBuilding: (buildingId: string) => void;
  routeResult: DijkstraResult | null;
  is3DMode: boolean;
  isNavigating: boolean;
  selectedFloor?: number;
}

export const PhotorealisticCampus3D: React.FC<PhotorealisticCampus3DProps> = ({
  selectedLocationId,
  sourceLocationId,
  onSelectBuilding,
  routeResult,
  is3DMode,
  isNavigating,
  selectedFloor = 1,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const locations = getCampusLocations();

  // Three.js Scene References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Group>>(new Map());
  const routeMeshRef = useRef<THREE.Mesh | null>(null);
  const particlesMeshRef = useRef<THREE.Points | null>(null);

  // Target camera animation references
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetCamLookRef = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. THREE.JS SCENE CREATION (Daylight Atmosphere)
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    scene.fog = new THREE.FogExp2(0x0a1628, 0.0018);
    sceneRef.current = scene;

    // 2. GOOGLE EARTH-STYLE PERSPECTIVE CAMERA
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1200);
    camera.position.set(0, 190, 240); // Angled aerial view
    cameraRef.current = camera;

    // 3. WEBGL RENDERER WITH SHADOWS & FILMIC TONE MAPPING
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. ORBIT CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 25;
    controls.maxDistance = 500;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 5. DAYLIGHT LIGHTING SYSTEM
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff8eb, 1.4);
    sunLight.position.set(150, 220, 120);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.4);
    scene.add(hemiLight);

    // 6. CAMPUS GREEN TERRAIN & ROADS
    const groundGeo = new THREE.PlaneGeometry(600, 600);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x0d2117, roughness: 0.85, metalness: 0.1 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Roads Grid Layer
    const roadGroup = new THREE.Group();
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 });

    // Main Campus Avenue Road
    const mainRoadGeo = new THREE.PlaneGeometry(30, 360);
    const mainRoad = new THREE.Mesh(mainRoadGeo, roadMat);
    mainRoad.rotation.x = -Math.PI / 2;
    mainRoad.position.set(-10, 0.2, 10);
    mainRoad.receiveShadow = true;
    roadGroup.add(mainRoad);

    // Ring Road East
    const eastRoadGeo = new THREE.PlaneGeometry(300, 24);
    const eastRoad = new THREE.Mesh(eastRoadGeo, roadMat);
    eastRoad.rotation.x = -Math.PI / 2;
    eastRoad.position.set(60, 0.2, 20);
    eastRoad.receiveShadow = true;
    roadGroup.add(eastRoad);

    scene.add(roadGroup);

    // 7. BUILD 16 REALISTIC CAMPUS BUILDINGS & GROUNDS
    const buildingMap = new Map<string, THREE.Group>();

    locations.forEach((loc) => {
      const bldgGroup = new THREE.Group();
      bldgGroup.position.set(loc.position3D[0], 0, loc.position3D[2]);
      bldgGroup.userData = { id: loc.id, name: loc.name, floorsCount: loc.floorsCount };

      const w = loc.dimensions.width;
      const l = loc.dimensions.length;
      const h = loc.heightMeters;

      if (loc.category === 'GROUND') {
        // Ground / Court Geometry (Volleyball, Basketball, Stadium)
        const groundSurfaceGeo = new THREE.PlaneGeometry(w, l);
        const groundSurfaceMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(loc.color),
          roughness: 0.6,
        });
        const groundSurface = new THREE.Mesh(groundSurfaceGeo, groundSurfaceMat);
        groundSurface.rotation.x = -Math.PI / 2;
        groundSurface.position.y = 0.4;
        bldgGroup.add(groundSurface);
      } else {
        // Architectural Building Mesh with Base, Roof & Windows
        const bldgGeo = new THREE.BoxGeometry(w, h, l);
        const bldgMat = new THREE.MeshStandardMaterial({
          color: 0x334155, // Neutral daylight gray
          roughness: 0.4,
          metalness: 0.2,
        });
        const bldgMesh = new THREE.Mesh(bldgGeo, bldgMat);
        bldgMesh.position.y = h / 2;
        bldgMesh.castShadow = true;
        bldgMesh.receiveShadow = true;
        bldgGroup.add(bldgMesh);

        // Glass Roof Accent
        const roofGeo = new THREE.BoxGeometry(w * 0.9, 1.5, l * 0.9);
        const roofMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(loc.color),
          emissive: new THREE.Color(loc.color),
          emissiveIntensity: 0.2,
          roughness: 0.1,
        });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = h + 0.75;
        bldgGroup.add(roof);

        // Floor Divider Lines
        for (let fl = 1; fl < loc.floorsCount; fl++) {
          const floorY = (h / loc.floorsCount) * fl;
          const bandGeo = new THREE.BoxGeometry(w + 0.5, 0.4, l + 0.5);
          const bandMat = new THREE.MeshBasicMaterial({ color: 0x1e293b });
          const band = new THREE.Mesh(bandGeo, bandMat);
          band.position.y = floorY;
          bldgGroup.add(band);
        }
      }

      scene.add(bldgGroup);
      buildingMap.set(loc.id, bldgGroup);
    });

    buildingMeshesRef.current = buildingMap;

    // 8. RAYCASTER FOR 3D CLICK SELECTION
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const hit of intersects) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && !curr.userData?.id && curr.parent !== scene) {
          curr = curr.parent;
        }
        if (curr && curr.userData?.id) {
          onSelectBuilding(curr.userData.id);
          break;
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 9. ANIMATION LOOP
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth Camera FlyTo Easing Animation
      if (targetCamPosRef.current && cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.05);
        if (targetCamLookRef.current) {
          controlsRef.current.target.lerp(targetCamLookRef.current, 0.05);
        }
        controlsRef.current.update();

        if (cameraRef.current.position.distanceTo(targetCamPosRef.current) < 0.5) {
          targetCamPosRef.current = null;
          targetCamLookRef.current = null;
        }
      } else {
        controls.update();
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
    };
  }, []);

  // 10. HIGHLIGHT SELECTED DESTINATION BUILDING ONLY (CRITICAL BUG FIX)
  useEffect(() => {
    buildingMeshesRef.current.forEach((group, id) => {
      const isSelected = selectedLocationId === id;
      const mesh = group.children[0] as THREE.Mesh;
      if (mesh && mesh.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (isSelected) {
          mat.color.setHex(0x0284c7);
          mat.emissive = new THREE.Color(0x00f0ff);
          mat.emissiveIntensity = 0.6;
        } else {
          mat.color.setHex(0x334155);
          mat.emissive = new THREE.Color(0x000000);
          mat.emissiveIntensity = 0.0;
        }
      }
    });

    // Smooth camera flyTo target building
    if (selectedLocationId) {
      const loc = locations.find((l) => l.id === selectedLocationId);
      if (loc && cameraRef.current && controlsRef.current) {
        const targetX = loc.position3D[0];
        const targetZ = loc.position3D[2];
        const targetY = (selectedFloor - 1) * 6 + 15;

        targetCamPosRef.current = new THREE.Vector3(targetX, targetY + 60, targetZ + 80);
        targetCamLookRef.current = new THREE.Vector3(targetX, targetY, targetZ);
      }
    }
  }, [selectedLocationId, selectedFloor]);

  // 11. RENDER 3D DIJKSTRA ROUTE LINE
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (routeMeshRef.current) {
      scene.remove(routeMeshRef.current);
      routeMeshRef.current.geometry.dispose();
      routeMeshRef.current = null;
    }

    if (!routeResult || routeResult.pathCoordinates.length < 2) return;

    const points = routeResult.pathCoordinates.map(
      (pt) => new THREE.Vector3(pt[0], 1.8, pt[2])
    );

    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, 64, 1.2, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: false,
    });

    const routeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(routeMesh);
    routeMeshRef.current = routeMesh;
  }, [routeResult]);

  return (
    <div className="w-full h-full relative overflow-hidden select-none rounded-2xl bg-[#0A1628]">
      {/* 3D CANVAS MOUNT */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* FLOATING 3D BUILDING LABELS */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {locations.map((loc) => {
          const isSelected = selectedLocationId === loc.id;
          const isSource = sourceLocationId === loc.id || sourceLocationId.includes(loc.code.toLowerCase());

          return (
            <div
              key={loc.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all duration-300 pointer-events-auto cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.8)] scale-110 z-30'
                  : isSource
                  ? 'bg-teal-600 text-white border border-teal-300 shadow-md z-20'
                  : 'bg-slate-950/80 text-slate-300 border border-slate-800 hover:border-cyan-500/50'
              }`}
              style={{
                left: `${50 + (loc.position3D[0] / 300) * 45}%`,
                top: `${48 + (loc.position3D[2] / 300) * 45}%`,
              }}
              onClick={() => onSelectBuilding(loc.id)}
            >
              {loc.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};
