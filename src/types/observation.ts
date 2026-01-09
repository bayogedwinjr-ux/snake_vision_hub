export interface Observation {
  id: string;
  species: string;
  length: number;
  weight?: number;
  location: string;
  dateObserved: string;
  pictureUrl?: string;
  notes?: string;
  createdAt: string;
}
