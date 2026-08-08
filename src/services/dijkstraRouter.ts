import campusData from '../data/campusData.json';

export interface GraphNode {
  id: string;
  name: string;
  type: string;
  block: string;
  floor: number;
  coordinates: [number, number];
}

export interface GraphEdge {
  source: string;
  target: string;
  weight: number;
  accessible?: boolean;
  stairs?: boolean;
  elevator?: boolean;
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
  nodesEvaluated: number;
  totalDistanceMeters: number;
  estimatedTimeMinutes: number;
  floorChanges: number;
  isAccessible: boolean;
  pathNodeIds: string[];
  pathCoordinates: [number, number][];
  steps: DijkstraStep[];
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

/**
 * Perform Dijkstra's Shortest Path Algorithm on Campus Graph
 */
export function runDijkstra(
  sourceNodeId: string,
  destNodeId: string,
  options: { accessibleOnly?: boolean } = {}
): DijkstraResult | null {
  const nodes = campusData.graphNodes as GraphNode[];
  const edges = campusData.graphEdges as GraphEdge[];

  const nodeMap = new Map<string, GraphNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const startNode = nodeMap.get(sourceNodeId);
  const endNode = nodeMap.get(destNodeId);

  if (!startNode || !endNode) return null;

  // Build Adjacency List
  const adj = new Map<string, Array<{ target: string; weight: number; stairs?: boolean; elevator?: boolean; accessible?: boolean }>>();
  nodes.forEach((n) => adj.set(n.id, []));

  edges.forEach((edge) => {
    if (options.accessibleOnly && edge.accessible === false) return;

    adj.get(edge.source)?.push({
      target: edge.target,
      weight: edge.weight,
      stairs: edge.stairs,
      elevator: edge.elevator,
      accessible: edge.accessible,
    });
    adj.get(edge.target)?.push({
      target: edge.source,
      weight: edge.weight,
      stairs: edge.stairs,
      elevator: edge.elevator,
      accessible: edge.accessible,
    });
  });

  // Dijkstra Data Structures
  const distances = new Map<string, number>();
  const previous = new Map<string, string>();
  const unvisited = new Set<string>();

  nodes.forEach((n) => {
    distances.set(n.id, Infinity);
    unvisited.add(n.id);
  });

  distances.set(sourceNodeId, 0);
  let nodesEvaluatedCount = 0;

  while (unvisited.size > 0) {
    // Select unvisited node with smallest distance
    let currentId: string | null = null;
    let minDistance = Infinity;

    unvisited.forEach((id) => {
      const d = distances.get(id) ?? Infinity;
      if (d < minDistance) {
        minDistance = d;
        currentId = id;
      }
    });

    if (!currentId || minDistance === Infinity) break;

    nodesEvaluatedCount++;

    if (currentId === destNodeId) break;

    unvisited.delete(currentId);

    const neighbors = adj.get(currentId) || [];
    for (const neighbor of neighbors) {
      if (!unvisited.has(neighbor.target)) continue;

      const alt = (distances.get(currentId) ?? Infinity) + neighbor.weight;
      if (alt < (distances.get(neighbor.target) ?? Infinity)) {
        distances.set(neighbor.target, alt);
        previous.set(neighbor.target, currentId);
      }
    }
  }

  const finalDist = distances.get(destNodeId);
  if (finalDist === undefined || finalDist === Infinity) return null;

  // Reconstruct Shortest Path
  const pathNodeIds: string[] = [destNodeId];
  let curr = destNodeId;
  while (previous.has(curr)) {
    curr = previous.get(curr)!;
    pathNodeIds.unshift(curr);
  }

  const pathCoordinates: [number, number][] = pathNodeIds.map(
    (id) => nodeMap.get(id)!.coordinates
  );

  let floorChanges = 0;
  let isAccessible = true;
  const steps: DijkstraStep[] = [];

  steps.push({
    stepIndex: 1,
    instruction: `Start at ${startNode.name} (${startNode.block})`,
    distance: 0,
    icon: 'START',
  });

  for (let i = 0; i < pathNodeIds.length - 1; i++) {
    const u = nodeMap.get(pathNodeIds[i])!;
    const v = nodeMap.get(pathNodeIds[i + 1])!;

    const segDist = Math.round(
      Math.hypot(v.coordinates[0] - u.coordinates[0], v.coordinates[1] - u.coordinates[1]) * 100000
    ) || 35;

    if (u.floor !== v.floor) {
      floorChanges += Math.abs(v.floor - u.floor);
      if (v.type === 'STAIRCASE') isAccessible = false;
    }

    let icon: 'WALK' | 'TURN_RIGHT' | 'TURN_LEFT' | 'STAIRS' | 'ELEVATOR' = 'WALK';
    let instr = `Walk ${segDist}m straight to ${v.name}`;

    if (v.type === 'STAIRCASE') {
      icon = 'STAIRS';
      instr = `Take Staircase to Floor ${v.floor}`;
    } else if (v.type === 'CLASSROOM' || v.type === 'LAB') {
      instr = `Enter ${v.name} (${v.block}, Floor ${v.floor})`;
    }

    steps.push({
      stepIndex: i + 2,
      instruction: instr,
      distance: segDist,
      icon,
    });
  }

  steps.push({
    stepIndex: steps.length + 1,
    instruction: `Arrived at Destination: ${endNode.name}`,
    distance: 0,
    icon: 'DESTINATION',
  });

  const estimatedTime = Math.max(1, Math.round(finalDist / 70) + floorChanges * 1.5);

  return {
    sourceNodeId,
    destNodeId,
    sourceName: startNode.name,
    destName: endNode.name,
    nodesEvaluated: nodesEvaluatedCount,
    totalDistanceMeters: finalDist,
    estimatedTimeMinutes: estimatedTime,
    floorChanges,
    isAccessible,
    pathNodeIds,
    pathCoordinates,
    steps,
  };
}

/**
 * Intelligent Classroom Resolver & Search Engine
 */
export function resolveClassroomQuery(query: string): ClassroomMatch | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  const blocks = campusData.blocks;

  for (const block of blocks) {
    for (const room of block.classrooms) {
      if (
        room.name.toLowerCase().includes(q) ||
        room.room_number.toLowerCase() === q ||
        `${block.code.toLowerCase()} ${room.room_number.toLowerCase()}`.includes(q) ||
        `${block.name.toLowerCase()} ${room.name.toLowerCase()}`.includes(q)
      ) {
        // Map classroom to corresponding graph node
        const matchingNode = (campusData.graphNodes as GraphNode[]).find(
          (n) => n.name.toLowerCase().includes(room.name.toLowerCase()) || n.block === block.name
        );

        return {
          id: room.id,
          name: room.name,
          block: block.name,
          floor: room.floor,
          roomNumber: room.room_number,
          type: room.type,
          nodeId: matchingNode ? matchingNode.id : 'n_admin_ent',
        };
      }
    }
  }

  // Fallback match by block name
  for (const block of blocks) {
    if (block.name.toLowerCase().includes(q) || block.code.toLowerCase().includes(q)) {
      const firstRoom = block.classrooms[0];
      const matchingNode = (campusData.graphNodes as GraphNode[]).find((n) => n.block === block.name);
      return {
        id: firstRoom ? firstRoom.id : block.id,
        name: firstRoom ? firstRoom.name : block.name,
        block: block.name,
        floor: firstRoom ? firstRoom.floor : '0',
        roomNumber: firstRoom ? firstRoom.room_number : '101',
        type: 'Block Main Entrance',
        nodeId: matchingNode ? matchingNode.id : 'n_admin_ent',
      };
    }
  }

  return null;
}
