export interface TouristSpot {
  id: string;
  name: string;
  category: 'resort' | 'landmark' | 'nature' | 'heritage';
  barangay: string;
  description: string;
  amenities?: string[];
  contact?: string;
  mapCoordinates?: {
    lat: string;
    lng: string;
  };
}

export interface LocalHoliday {
  event: string;
  date: string;
  day: string;
  type: 'regular' | 'special-non-working' | 'local-taytay';
}
