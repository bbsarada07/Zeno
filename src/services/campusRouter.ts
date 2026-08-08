import campusData from '../data/campusData.json';
import { calculateDistanceMeters } from './spatialSearchService';

export interface RoutingNode {
  id: string;
  name: string;
  coordinates: [number, number];
  floor: number;
  isElevator?: boolean;
  isStairs?: boolean;
  neighbors: string[];
}

export interface RouteStep {
  stepNumber: number;
  instruction: string;
  distanceMeters: number;
  floor: number;
  iconType: 'WALK' | 'ELEVATOR' | 'STAIRS' | 'DESTINATION';
}

export interface RouteResult {
  pathNodeIds: string[];
  pathCoordinates: [number, number][];
  totalDistanceMeters: number;
  estimatedTimeMinutes: number;
  floorChanges: number;
  isStepFree: boolean;
  steps: RouteStep[];
}

/**
 * A* Pathfinding Algorithm operating on the bundled 3D spatial routing graph.
 */
export function calculateCampusRoute(
  startNodeId: string,
  targetNodeId: string,
  preferElevator: boolean = true
): RouteResult | null {
  const nodes = (campusData.routingNodes as unknown) as RoutingNode[];
  const nodeMap = new Map<string, RoutingNode>();
  nodes.forEach((n) => nodeMap.set(n.id, n));

  const startNode = nodeMap.get(startNodeId);
  const targetNode = nodeMap.get(targetNodeId);

  if (!startNode || !targetNode) return null;

  // A* Data Structures
  const openSet = new Set<string>([startNodeId]);
  const cameFrom = new Map<string, string>();

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();

  nodes.forEach((n) => {
    gScore.set(n.id, Infinity);
    fScore.set(n.id, Infinity);
  });

  gScore.set(startNodeId, 0);
  fScore.set(startNodeId, calculateDistanceMeters(startNode.coordinates, targetNode.coordinates));

  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let currentId = Array.from(openSet).reduce((lowest, id) =>
      (fScore.get(id) ?? Infinity) < (fScore.get(lowest) ?? Infinity) ? id : lowest
    );

    if (currentId === targetNodeId) {
      // Reconstruct Path
      const pathNodeIds: string[] = [currentId];
      while (cameFrom.has(currentId)) {
        currentId = cameFrom.get(currentId)!;
        pathNodeIds.unshift(currentId);
      }

      // Build Detailed Route Result
      const pathCoordinates: [number, number][] = pathNodeIds.map(
        (id) => nodeMap.get(id)!.coordinates
      );

      let totalDistance = 0;
      let floorChanges = 0;
      let isStepFree = true;
      const steps: RouteStep[] = [];

      for (let i = 0; i < pathNodeIds.length - 1; i++) {
        const curr = nodeMap.get(pathNodeIds[i])!;
        const next = nodeMap.get(pathNodeIds[i + 1])!;

        const segmentDist = calculateDistanceMeters(curr.coordinates, next.coordinates) || 12;
        totalDistance += segmentDist;

        if (curr.floor !== next.floor) {
          floorChanges += Math.abs(next.floor - curr.floor);
          if (next.isStairs || curr.isStairs) isStepFree = false;
        }

        let iconType: 'WALK' | 'ELEVATOR' | 'STAIRS' | 'DESTINATION' = 'WALK';
        let actionText = `Walk ${segmentDist}m towards ${next.name}`;

        if (curr.floor !== next.floor) {
          if (next.isElevator || curr.isElevator) {
            iconType = 'ELEVATOR';
            actionText = `Take Elevator from Floor ${curr.floor} to Floor ${next.floor}`;
          } else {
            iconType = 'STAIRS';
            actionText = `Take Staircase from Floor ${curr.floor} to Floor ${next.floor}`;
          }
        }

        steps.push({
          stepNumber: i + 1,
          instruction: actionText,
          distanceMeters: segmentDist,
          floor: curr.floor,
          iconType,
        });
      }

      steps.push({
        stepNumber: steps.length + 1,
        instruction: `Arrived at Destination: ${targetNode.name}`,
        distanceMeters: 0,
        floor: targetNode.floor,
        iconType: 'DESTINATION',
      });

      const walkingTime = Math.max(1, Math.round(totalDistance / 75) + floorChanges * 1.5);

      return {
        pathNodeIds,
        pathCoordinates,
        totalDistanceMeters: totalDistance,
        estimatedTimeMinutes: walkingTime,
        floorChanges,
        isStepFree,
        steps,
      };
    }

    openSet.delete(currentId);
    const currNode = nodeMap.get(currentId)!;

    currNode.neighbors.forEach((neighborId) => {
      const neighborNode = nodeMap.get(neighborId);
      if (!neighborNode) return;

      // Penalize non-preferred floor transition types
      let penalty = 0;
      if (currNode.floor !== neighborNode.floor) {
        if (!preferElevator && neighborNode.isElevator) penalty = 50;
        if (preferElevator && neighborNode.isStairs) penalty = 30;
      }

      const tentativeG =
        (gScore.get(currentId) ?? Infinity) +
        calculateDistanceMeters(currNode.coordinates, neighborNode.coordinates) +
        penalty;

      if (tentativeG < (gScore.get(neighborId) ?? Infinity)) {
        cameFrom.set(neighborId, currentId);
        gScore.set(neighborId, tentativeG);
        fScore.set(
          neighborId,
          tentativeG + calculateDistanceMeters(neighborNode.coordinates, targetNode.coordinates)
        );
        openSet.add(neighborId);
      }
    });
  }

  return null;
}
