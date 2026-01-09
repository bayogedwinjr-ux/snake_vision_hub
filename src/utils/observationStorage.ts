import { Observation } from "@/types/observation";

const STORAGE_KEY = "snake_observations";

export const getObservations = (): Observation[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveObservation = (observation: Omit<Observation, "id" | "createdAt">): Observation => {
  const observations = getObservations();
  const newObservation: Observation = {
    ...observation,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
  observations.push(newObservation);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(observations));
  return newObservation;
};

export const deleteObservation = (id: string): void => {
  const observations = getObservations().filter(obs => obs.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(observations));
};
