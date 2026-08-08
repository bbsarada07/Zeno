export interface CampusLocation {
  id: string;
  name: string;
  category: 'FACULTY' | 'ROOM' | 'CANTEEN' | 'OFFICE' | 'SPORTS' | 'SERVICE';
  building: string;
  floor: number;
  roomNumber?: string;
  facultyDetails?: {
    name: string;
    designation: string;
    department: string;
    officeHours: string;
  };
  coordinates: [number, number]; // [Longitude, Latitude]
  accessible: boolean;
}

/**
 * Perform deep fuzzy searching across natural language queries, room numbers, building names, and faculty details.
 */
export function searchCampusLocations(query: string, data: CampusLocation[]): CampusLocation[] {
  const q = query.toLowerCase().trim();
  if (!q) return data;

  return data.filter(
    (item) =>
      item.name.toLowerCase().includes(q) ||
      item.building.toLowerCase().includes(q) ||
      (item.roomNumber && item.roomNumber.toLowerCase().includes(q)) ||
      (item.facultyDetails && item.facultyDetails.name.toLowerCase().includes(q)) ||
      (item.facultyDetails && item.facultyDetails.department.toLowerCase().includes(q)) ||
      item.category.toLowerCase().includes(q)
  );
}

/**
 * Calculate Euclidean/Haversine distance between two geographic coordinate pairs in meters.
 */
export function calculateDistanceMeters(
  coords1: [number, number],
  coords2: [number, number]
): number {
  const [lon1, lat1] = coords1;
  const [lon2, lat2] = coords2;

  const R = 6371000; // Earth radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Finds the nearest campus facility matching a category (e.g. CANTEEN, SERVICE, FACULTY).
 */
export function findNearestFacility(
  userCoords: [number, number],
  category: string,
  locations: CampusLocation[]
): { location: CampusLocation; distanceMeters: number } | null {
  const targetCategory = category.toUpperCase();
  const matchingLocations = locations.filter((loc) =>
    loc.category === targetCategory || loc.name.toUpperCase().includes(targetCategory)
  );

  if (matchingLocations.length === 0) return null;

  let nearest: CampusLocation | null = null;
  let minDistance = Infinity;

  matchingLocations.forEach((loc) => {
    const dist = calculateDistanceMeters(userCoords, loc.coordinates);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = loc;
    }
  });

  if (!nearest) return null;

  return {
    location: nearest,
    distanceMeters: minDistance,
  };
}
