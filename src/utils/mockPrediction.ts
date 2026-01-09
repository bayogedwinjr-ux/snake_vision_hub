import { snakeSpecies } from "@/data/snakeSpecies";

export interface PredictionResult {
  speciesName: string;
  scientificName: string;
  confidence: number;
  description: string;
}

export const getMockPrediction = (filename?: string): PredictionResult => {
  // Simulate ML prediction with random species selection
  const randomIndex = Math.floor(Math.random() * snakeSpecies.length);
  const species = snakeSpecies[randomIndex];
  
  // Generate confidence between 0.7 and 0.99
  const confidence = Math.round((0.7 + Math.random() * 0.29) * 100) / 100;
  
  return {
    speciesName: species.commonName,
    scientificName: species.scientificName,
    confidence,
    description: species.description
  };
};
