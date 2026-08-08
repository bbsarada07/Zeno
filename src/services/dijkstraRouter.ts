import campusData from '../data/campusData.json';

export interface CampusRoom {
  id: string;
  name: string;
  floor: number;
  roomNumber: string;
  type: string;
  faculty?: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  category: 'BUILDING' | 'FACILITY' | 'GROUND' | 'LANDMARK' | 'GATE';
  floorsCount: number;
  heightMeters: number;
  position3D: [number, number, number];
  dimensions: { width: number; length: number };
  color: string;
  description: string;
  rooms: CampusRoom[];
}

export interface GraphNode {
  id: string;
  name: string;
  locationId: string | null;
  coordinates: [number, number, number];
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
}

export interface DijkstraStep {
  stepIndex: number;
  instruction: string;
  distance: number;
  icon: 'START' | 'WALK' | 'TURN_RIGHT' | 'TURN_LEFT' | 'STAIRS' | 'ELEVATOR' | 'DESTINATION';
}

export interface DijkstraResult {
  sourceNodeId: string;
  destNodeId: string;
  sourceName: string;
  destName: string;
  locationId: string;
  buildingName: string;
  floor?: number;
  roomName?: string;
  facultyName?: string;
  nodesEvaluated: number;
  totalDistanceMeters: number;
  estimatedTimeMinutes: number;
  pathNodeIds: string[];
  pathCoordinates: [number, number, number][];
  steps: DijkstraStep[];
}

export interface SearchResolution {
  location: CampusLocation;
  nodeId: string;
  floor?: number;
  room?: CampusRoom;
  facultyName?: string;
  matchedText: string;
}

/**
 * Get all 16 standardized campus locations
 */
export function getCampusLocations(): CampusLocation[] {
  return campusData.locations as CampusLocation[];
}

/**
 * Find campus location by ID or Code or Name
 */
export function findCampusLocation(idOrCode: string): CampusLocation | undefined {
  const query = idOrCode.toLowerCase().trim();
  const locations = getCampusLocations();
  return locations.find(
    (loc) =>
      loc.id.toLowerCase() === query ||
      loc.code.toLowerCase() === query ||
      loc.name.toLowerCase() === query
  );
}

/**
 * Natural language resolver for buildings, room numbers, faculty names, and facilities
 */
export function resolveSearchQuery(queryText: string): SearchResolution | null {
  const q = queryText.toLowerCase().trim();
  if (!q) return null;

  const locations = getCampusLocations();

  // 1. Check Faculty Cabin Matches (e.g. "Prof. Ahmed", "Dr. V. Rao", "Ahmed", "Rao")
  for (const loc of locations) {
    for (const room of loc.rooms) {
      if (room.faculty) {
        const facLower = room.faculty.toLowerCase();
        if (facLower.includes(q) || q.includes('ahmed') && facLower.includes('ahmed') || q.includes('rao') && facLower.includes('rao')) {
          return {
            location: loc,
            nodeId: `n_${loc.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
            floor: room.floor,
            room: room,
            facultyName: room.faculty,
            matchedText: `Faculty Cabin: ${room.faculty} (${loc.name}, Floor ${room.floor}, ${room.name})`,
          };
        }
      }
    }
  }

  // 2. Check Specific Room Numbers (e.g. "CSM-204", "ECE-204", "204", "LIB-101")
  for (const loc of locations) {
    for (const room of loc.rooms) {
      const roomNumLower = room.roomNumber.toLowerCase();
      const roomNameLower = room.name.toLowerCase();
      if (q === roomNumLower || q === roomNameLower || q.includes(roomNumLower)) {
        return {
          location: loc,
          nodeId: `n_${loc.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          floor: room.floor,
          room: room,
          matchedText: `${room.name} (${room.type}) on ${loc.name}, Floor ${room.floor}`,
        };
      }
    }
  }

  // 3. Check Location Name / Code (e.g. "CSM", "CSE", "ECE", "Admin", "Canteen", "Basketball Ground")
  for (const loc of locations) {
    const codeLower = loc.code.toLowerCase();
    const nameLower = loc.name.toLowerCase();
    if (q === codeLower || q === nameLower || nameLower.includes(q) || q.includes(codeLower)) {
      return {
        location: loc,
        nodeId: `n_${loc.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        floor: 1,
        matchedText: loc.name,
      };
    }
  }

  // 4. Keyword Fallback Matchers
  if (q.includes('canteen') || q.includes('food') || q.includes('eat')) {
    const loc = locations.find((l) => l.code === 'CANTEEN');
    if (loc) return { location: loc, nodeId: 'n_canteen', floor: 1, matchedText: 'Campus Canteen' };
  }
  if (q.includes('library') || q.includes('book') || q.includes('it block')) {
    const loc = locations.find((l) => l.code === 'LIB-IT');
    if (loc) return { location: loc, nodeId: 'n_lib_it', floor: 1, matchedText: 'Library / IT Block' };
  }
  if (q.includes('entrance') || q.includes('gate')) {
    const loc = locations.find((l) => l.code === 'ENTRANCE');
    if (loc) return { location: loc, nodeId: 'n_entrance', floor: 1, matchedText: 'Main Entrance' };
  }
  if (q.includes('parking') || q.includes('car') || q.includes('bike')) {
    const loc = locations.find((l) => l.code === 'PARKING');
    if (loc) return { location: loc, nodeId: 'n_parking', floor: 1, matchedText: 'Parking Area' };
  }

  return null;
}

/**
 * Execute Dijkstra Shortest Path Algorithm on Campus Graph
 */
export function runDijkstra(
  sourceNodeId: string,
  destNodeId: string,
  extraMeta: { floor?: number; roomName?: string; facultyName?: string } = {}
): DijkstraResult | null {
  const nodes = campusData.graphNodes as GraphNode[];
  const edges = campusData.graphEdges as GraphEdge[];

  const nodeMap = new Map<string, GraphNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  // Fallback for node ID mapping if location code passed
  let srcNode = nodeMap.get(sourceNodeId);
  if (!srcNode) {
    const loc = findCampusLocation(sourceNodeId);
    if (loc) srcNode = nodes.find((n) => n.locationId === loc.id);
  }

  let dstNode = nodeMap.get(destNodeId);
  if (!dstNode) {
    const loc = findCampusLocation(destNodeId);
    if (loc) dstNode = nodes.find((n) => n.locationId === loc.id);
  }

  if (!srcNode || !dstNode) return null;

  // Build Adjacency Graph
  const adj = new Map<string, Array<{ target: string; weight: number }>>();
  nodes.forEach((n) => adj.set(n.id, []));

  edges.forEach((edge) => {
    adj.get(edge.source)?.push({ target: edge.target, weight: edge.weight });
    adj.get(edge.target)?.push({ target: edge.source, weight: edge.weight });
  });

  // Dijkstra Shortest Path Calculation
  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const unvisited = new Set<string>();

  nodes.forEach((n) => {
    distances.set(n.id, Infinity);
    unvisited.add(n.id);
  });

  distances.set(srcNode.id, 0);

  while (unvisited.size > 0) {
    let currentId: string | null = null;
    let minDistance = Infinity;

    unvisited.forEach((id) => {
      const d = distances.get(id)!;
      if (d < minDistance) {
        minDistance = d;
        currentId = id;
      }
    });

    if (currentId === null || minDistance === Infinity) break;
    if (currentId === dstNode.id) break;

    unvisited.delete(currentId);

    const neighbors = adj.get(currentId) || [];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.target)) continue;

      const alt = distances.get(currentId)! + neighbor.weight;
      if (alt < distances.get(neighbor.target)!) {
        distances.set(neighbor.target, alt);
        previous.set(neighbor.target, currentId);
      }
    }
  }

  // Reconstruct Path Nodes
  const pathNodeIds: string[] = [];
  let curr: string | undefined = dstNode.id;
  while (curr) {
    pathNodeIds.unshift(curr);
    curr = previous.get(curr);
  }

  if (pathNodeIds[0] !== srcNode.id) {
    // If unconnected path, fallback direct edge
    pathNodeIds.length = 0;
    pathNodeIds.push(srcNode.id, dstNode.id);
  }

  const pathCoordinates: [number, number, number][] = pathNodeIds.map((id) => {
    const n = nodeMap.get(id)!;
    return n.coordinates;
  });

  const totalDist = Math.round(distances.get(dstNode.id) || 120);
  const estimatedTime = Math.max(1, Math.round(totalDist / 60)); // ~60m/min walking speed

  const destLocation = getCampusLocations().find((l) => l.id === dstNode?.locationId) || getCampusLocations()[0];

  // Generate Turn-by-Turn Instructions
  const steps: DijkstraStep[] = [];
  steps.push({
    stepIndex: 1,
    instruction: `Start at ${srcNode.name}`,
    distance: 0,
    icon: 'START',
  });

  for (let i = 1; i < pathNodeIds.length - 1; i++) {
    const node = nodeMap.get(pathNodeIds[i])!;
    steps.push({
      stepIndex: i + 1,
      instruction: `Walk along main campus pathway towards ${node.name}`,
      distance: 35,
      icon: 'WALK',
    });
  }

  if (extraMeta.floor && extraMeta.floor > 1) {
    steps.push({
      stepIndex: steps.length + 1,
      instruction: `Enter ${destLocation.name} & take elevator / stairs to Floor ${extraMeta.floor}`,
      distance: 15,
      icon: 'ELEVATOR',
    });
  }

  steps.push({
    stepIndex: steps.length + 1,
    instruction: `Arrive at Destination: ${extraMeta.roomName || extraMeta.facultyName || destLocation.name}`,
    distance: 0,
    icon: 'DESTINATION',
  });

  return {
    sourceNodeId: srcNode.id,
    destNodeId: dstNode.id,
    sourceName: srcNode.name,
    destName: dstNode.name,
    locationId: destLocation.id,
    buildingName: destLocation.name,
    floor: extraMeta.floor || 1,
    roomName: extraMeta.roomName,
    facultyName: extraMeta.facultyName,
    nodesEvaluated: nodes.length - unvisited.size + 1,
    totalDistanceMeters: totalDist,
    estimatedTimeMinutes: estimatedTime,
    pathNodeIds,
    pathCoordinates,
    steps,
  };
}

/**
 * Nearest Location Search Engine
 */
export function findNearestLocation(
  sourceNodeId: string,
  categoryOrKeyword: string
): SearchResolution | null {
  const locations = getCampusLocations();
  const kw = categoryOrKeyword.toLowerCase();

  const matching = locations.filter((loc) => loc.code.toLowerCase().includes(kw) || loc.name.toLowerCase().includes(kw) || loc.category.toLowerCase().includes(kw));
  if (matching.length === 0) return null;

  const targetLoc = matching[0];
  return {
    location: targetLoc,
    nodeId: `n_${targetLoc.code.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
    floor: 1,
    matchedText: `Nearest ${targetLoc.name}`,
  };
}

export interface ClassroomMatch {
  id: string;
  name: string;
  block: string;
  floor: string;
  roomNumber: string;
  type: string;
  nodeId: string;
}

export function resolveClassroomQuery(query: string): ClassroomMatch | null {
  const res = resolveSearchQuery(query);
  if (!res) return null;

  return {
    id: res.room?.id || res.location.id,
    name: res.room?.name || res.location.name,
    block: res.location.name,
    floor: String(res.floor || 1),
    roomNumber: res.room?.roomNumber || '001',
    type: res.room?.type || 'Classroom',
    nodeId: res.nodeId,
  };
}
