import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import campusData from '../data/campusData.json';
import { getCampusLocations } from '../services/dijkstraRouter';
import type { DijkstraResult } from '../services/dijkstraRouter';

interface PhotorealisticCampus3DProps {
  selectedLocationId: string | null;
  sourceLocationId: string;
  onSelectBuilding: (buildingId: string) => void;
  routeResult: DijkstraResult | null;
  is3DMode: boolean;
  isNavigating: boolean;
  selectedFloor?: number;
  activeStepIndex?: number;
}

// Graph node coordinate lookup from campusData (client-side only)
interface GraphNodeRaw {
  id: string;
  coordinates: [number, number, number];
}
interface GraphEdgeRaw {
  source: string;
  target: string;
  weight: number;
}

export const PhotorealisticCampus3D: React.FC<PhotorealisticCampus3DProps> = ({
  selectedLocationId,
  sourceLocationId,
  onSelectBuilding,
  routeResult,
  selectedFloor = 1,
  activeStepIndex = 0,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const locations = getCampusLocations();

  // Scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const buildingMeshesRef = useRef<Map<string, THREE.Group>>(new Map());

  // Route geometry refs
  const routeTubeRef = useRef<THREE.Mesh | null>(null);
  const arrowMeshesRef = useRef<THREE.Mesh[]>([]);

  // Camera animation targets
  const targetCamPosRef = useRef<THREE.Vector3 | null>(null);
  const targetCamLookRef = useRef<THREE.Vector3 | null>(null);

  // ─── SCENE INIT (runs once) ───────────────────────────────────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1628);
    scene.fog = new THREE.FogExp2(0x0a1628, 0.0016);
    sceneRef.current = scene;

    // Camera — angled Google Earth perspective
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1400);
    camera.position.set(0, 200, 260);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05;
    controls.minDistance = 20;
    controls.maxDistance = 550;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // ── LIGHTING ──────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    const sun = new THREE.DirectionalLight(0xfff8eb, 1.5);
    sun.position.set(150, 250, 120);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    scene.add(sun);

    scene.add(new THREE.HemisphereLight(0x38bdf8, 0x0f172a, 0.45));

    // ── TERRAIN GROUND ────────────────────────────────────────────────────
    const groundGeo = new THREE.PlaneGeometry(700, 700);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x0d2117,
      roughness: 0.85,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ── ROAD RIBBONS FROM GRAPH EDGES ─────────────────────────────────────
    // Build a node-coord lookup from the actual graph data
    const graphNodes = (campusData.graphNodes as unknown) as GraphNodeRaw[];
    const graphEdges = campusData.graphEdges as GraphEdgeRaw[];
    const nodeCoords = new Map<string, THREE.Vector3>();
    graphNodes.forEach((n) => {
      nodeCoords.set(n.id, new THREE.Vector3(n.coordinates[0], 0, n.coordinates[2]));
    });

    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x1e2d3d,
      roughness: 0.92,
      metalness: 0.05,
    });
    const laneMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.9,
    });

    graphEdges.forEach((edge) => {
      const a = nodeCoords.get(edge.source);
      const b = nodeCoords.get(edge.target);
      if (!a || !b) return;

      const dir = new THREE.Vector3().subVectors(b, a);
      const length = dir.length();
      const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
      const angle = Math.atan2(dir.x, dir.z);

      // Road ribbon (8 units wide)
      const roadGeo = new THREE.PlaneGeometry(8, length);
      const road = new THREE.Mesh(roadGeo, roadMat);
      road.rotation.x = -Math.PI / 2;
      road.rotation.z = -angle;
      road.position.set(mid.x, 0.12, mid.z);
      road.receiveShadow = true;
      scene.add(road);

      // Centre lane stripe (1.2 units wide, dashed-look via shorter geo)
      const laneGeo = new THREE.PlaneGeometry(1.2, length * 0.82);
      const lane = new THREE.Mesh(laneGeo, laneMat);
      lane.rotation.x = -Math.PI / 2;
      lane.rotation.z = -angle;
      lane.position.set(mid.x, 0.16, mid.z);
      scene.add(lane);
    });

    // ── CAMPUS BUILDINGS ──────────────────────────────────────────────────
    const buildingMap = new Map<string, THREE.Group>();

    locations.forEach((loc) => {
      const group = new THREE.Group();
      group.position.set(loc.position3D[0], 0, loc.position3D[2]);
      group.userData = { id: loc.id, name: loc.name };

      const w = loc.dimensions.width;
      const l = loc.dimensions.length;
      const h = loc.heightMeters;

      if (loc.category === 'GROUND') {
        // Sports surfaces
        const geo = new THREE.PlaneGeometry(w, l);
        const mat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(loc.color),
          roughness: 0.6,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.y = 0.4;
        group.add(mesh);
      } else {
        // Main building body
        const bGeo = new THREE.BoxGeometry(w, h, l);
        const bMat = new THREE.MeshStandardMaterial({
          color: 0x334155,
          roughness: 0.4,
          metalness: 0.2,
        });
        const bMesh = new THREE.Mesh(bGeo, bMat);
        bMesh.position.y = h / 2;
        bMesh.castShadow = true;
        bMesh.receiveShadow = true;
        group.add(bMesh);

        // Coloured glass roof accent
        const roofGeo = new THREE.BoxGeometry(w * 0.9, 1.6, l * 0.9);
        const roofMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(loc.color),
          emissive: new THREE.Color(loc.color),
          emissiveIntensity: 0.18,
          roughness: 0.1,
        });
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.y = h + 0.8;
        group.add(roof);

        // Floor-divider bands
        for (let fl = 1; fl < loc.floorsCount; fl++) {
          const flY = (h / loc.floorsCount) * fl;
          const band = new THREE.Mesh(
            new THREE.BoxGeometry(w + 0.6, 0.45, l + 0.6),
            new THREE.MeshBasicMaterial({ color: 0x1e293b })
          );
          band.position.y = flY;
          group.add(band);
        }
      }

      scene.add(group);
      buildingMap.set(loc.id, group);
    });

    buildingMeshesRef.current = buildingMap;

    // ── RAYCASTER FOR CLICK ───────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const hits = raycaster.intersectObjects(scene.children, true);
      for (const hit of hits) {
        let curr: THREE.Object3D | null = hit.object;
        while (curr && !curr.userData?.id && curr.parent !== scene) {
          curr = curr.parent;
        }
        if (curr?.userData?.id) {
          onSelectBuilding(curr.userData.id);
          break;
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // ── ANIMATION LOOP ────────────────────────────────────────────────────
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera lerp fly-to
      if (targetCamPosRef.current && cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(targetCamPosRef.current, 0.05);
        if (targetCamLookRef.current) {
          controlsRef.current.target.lerp(targetCamLookRef.current, 0.05);
        }
        if (cameraRef.current.position.distanceTo(targetCamPosRef.current) < 0.6) {
          targetCamPosRef.current = null;
          targetCamLookRef.current = null;
        }
      }

      // Animate arrow cones — pulsing Y float
      arrowMeshesRef.current.forEach((cone, idx) => {
        cone.position.y = 2.5 + Math.sin(elapsed * 2.2 + idx * 0.75) * 0.35;
      });

      controls.update();
      renderer.render(scene, camera);
    };

    // Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w2 = container.clientWidth;
      const h2 = container.clientHeight;
      cameraRef.current.aspect = w2 / h2;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w2, h2);
    };
    window.addEventListener('resize', handleResize);

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── BUILDING HIGHLIGHT ───────────────────────────────────────────────────
  useEffect(() => {
    buildingMeshesRef.current.forEach((group, id) => {
      const isSelected = selectedLocationId === id;
      const mesh = group.children[0] as THREE.Mesh;
      if (mesh?.material) {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        if (isSelected) {
          mat.color.setHex(0x0284c7);
          mat.emissive = new THREE.Color(0x06b6d4);
          mat.emissiveIntensity = 0.7;
        } else {
          mat.color.setHex(0x334155);
          mat.emissive = new THREE.Color(0x000000);
          mat.emissiveIntensity = 0.0;
        }
      }
    });

    // Fly camera to selected building
    if (selectedLocationId) {
      const loc = locations.find((l) => l.id === selectedLocationId);
      if (loc) {
        const tx = loc.position3D[0];
        const tz = loc.position3D[2];
        const ty = (selectedFloor - 1) * 6 + 15;
        targetCamPosRef.current = new THREE.Vector3(tx, ty + 65, tz + 90);
        targetCamLookRef.current = new THREE.Vector3(tx, ty, tz);
      }
    }
  }, [selectedLocationId, selectedFloor, locations]);

  // ─── ROUTE TUBE + DIRECTIONAL ARROWS ─────────────────────────────────────
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // --- Cleanup previous route geometry ---
    if (routeTubeRef.current) {
      scene.remove(routeTubeRef.current);
      routeTubeRef.current.geometry.dispose();
      (routeTubeRef.current.material as THREE.Material).dispose();
      routeTubeRef.current = null;
    }
    arrowMeshesRef.current.forEach((cone) => {
      scene.remove(cone);
      cone.geometry.dispose();
      (cone.material as THREE.Material).dispose();
    });
    arrowMeshesRef.current = [];

    if (!routeResult || routeResult.pathCoordinates.length < 2) return;

    const coords = routeResult.pathCoordinates;

    // --- Elevated Emissive Route Tube ---
    const points = coords.map((pt) => new THREE.Vector3(pt[0], 1.35, pt[2]));
    const curve = new THREE.CatmullRomCurve3(points);
    const tubeGeo = new THREE.TubeGeometry(curve, Math.max(64, coords.length * 12), 1.0, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x06b6d4,
      emissive: new THREE.Color(0x06b6d4),
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,   // ← prevents Z-fighting against ground and buildings
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    tube.renderOrder = 2;  // ← drawn on top
    scene.add(tube);
    routeTubeRef.current = tube;

    // --- 3D Directional Arrow Cones per segment ---
    const UP = new THREE.Vector3(0, 1, 0);
    const arrowMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: new THREE.Color(0x00f0ff),
      emissiveIntensity: 1.2,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });

    for (let i = 0; i < coords.length - 1; i++) {
      const a = new THREE.Vector3(coords[i][0], 2.5, coords[i][2]);
      const b = new THREE.Vector3(coords[i + 1][0], 2.5, coords[i + 1][2]);

      const dir = new THREE.Vector3().subVectors(b, a).normalize();
      if (dir.length() < 0.01) continue;

      // Place arrow at 1/3 and 2/3 along each segment for denser coverage
      [0.35, 0.65].forEach((frac) => {
        const pos = new THREE.Vector3().lerpVectors(a, b, frac);

        const coneGeo = new THREE.ConeGeometry(1.1, 3.2, 8);
        const cone = new THREE.Mesh(coneGeo, arrowMat.clone());
        cone.position.copy(pos);
        cone.renderOrder = 3;

        // Orient cone tip toward next node
        const quat = new THREE.Quaternion();
        quat.setFromUnitVectors(UP, dir);
        cone.setRotationFromQuaternion(quat);

        scene.add(cone);
        arrowMeshesRef.current.push(cone);
      });
    }
  }, [routeResult]);

  // ─── STEP-SYNCED CAMERA ───────────────────────────────────────────────────
  useEffect(() => {
    if (!routeResult || routeResult.pathCoordinates.length === 0) return;
    const idx = Math.min(activeStepIndex, routeResult.pathCoordinates.length - 1);
    const coord = routeResult.pathCoordinates[idx];
    if (!coord) return;

    targetCamPosRef.current = new THREE.Vector3(coord[0], 60, coord[2] + 80);
    targetCamLookRef.current = new THREE.Vector3(coord[0], 0, coord[2]);
  }, [activeStepIndex, routeResult]);

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full relative overflow-hidden select-none rounded-2xl bg-[#0A1628]">
      {/* THREE.JS CANVAS */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* FLOATING BUILDING LABELS (CSS overlay) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {locations.map((loc) => {
          const isSelected = selectedLocationId === loc.id;
          const isSource =
            sourceLocationId === loc.id ||
            sourceLocationId.includes(loc.code.toLowerCase());

          return (
            <div
              key={loc.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold transition-all duration-300 pointer-events-auto cursor-pointer ${
                isSelected
                  ? 'bg-blue-600 text-white border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.8)] scale-110 z-30'
                  : isSource
                  ? 'bg-teal-700 text-white border border-teal-300 shadow-md z-20'
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

      {/* LEGEND BADGE */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center space-x-3 px-3 py-1.5 rounded-xl bg-slate-950/85 border border-slate-800 text-[10px] text-slate-400 font-mono backdrop-blur-md">
        <span className="flex items-center space-x-1">
          <span className="w-3 h-1.5 rounded bg-teal-500 inline-block" />
          <span>Source</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-3 h-1.5 rounded bg-blue-500 inline-block" />
          <span>Destination</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-3 h-1.5 rounded bg-cyan-400 inline-block" />
          <span>Route</span>
        </span>
        <span className="flex items-center space-x-1">
          <span className="w-2 h-2 rounded-sm" style={{ background: '#1e2d3d' }} />
          <span>Roads</span>
        </span>
      </div>
    </div>
  );
};
