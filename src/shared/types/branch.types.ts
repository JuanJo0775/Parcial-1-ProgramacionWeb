export type Department = 'Caldas' | 'Risaralda' | 'Quindío';

export interface Branch {
  id: string;
  name: string;
  city: string;
  department: Department;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  openHours: string;
}

export interface Coords {
  lat: number;
  lng: number;
}