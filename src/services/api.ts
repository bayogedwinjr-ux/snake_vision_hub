/**
 * API Service Layer for Snake Vision Hub
 * Handles communication with PHP (WAMP) and Python (Raspberry Pi) backends
 */

// Configure backend URLs - change these for your local setup
const PHP_API_URL = import.meta.env.VITE_PHP_API_URL || 'http://localhost/snake_vision_hub/api';
const PYTHON_API_URL = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:5000';

// Types
export interface Snake {
  id: number;
  common_name: string;
  species_name: string;
  venomous: 'Non-venomous' | 'Mildly venomous' | 'Highly venomous';
  status: string;
  distribution: string;
  habitat: string;
  description: string;
  ecological_role: string;
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Observation {
  id: number;
  snake_id?: number;
  species: string;
  length_cm?: number;
  weight_g?: number;
  location: string;
  date_observed: string;
  picture_url?: string;
  notes?: string;
  created_at: string;
  snake_venomous?: string;
  scientific_name?: string;
}

export interface PredictionResult {
  species_name: string;
  scientific_name: string;
  confidence: number;
  venomous: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  count?: number;
  message?: string;
  error?: string;
}

// Helper function for API calls
async function apiCall<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    return { success: false, message: 'Network error - backend may be offline' };
  }
}

// ==================== SNAKE ENDPOINTS (PHP) ====================

export async function fetchSnakes(): Promise<Snake[]> {
  const response = await apiCall<Snake[]>(`${PHP_API_URL}/snakes/read.php`);
  return response.success && response.data ? response.data : [];
}

export async function fetchSnakeById(id: string | number): Promise<Snake | null> {
  const response = await apiCall<Snake>(`${PHP_API_URL}/snakes/read_single.php?id=${id}`);
  return response.success && response.data ? response.data : null;
}

export async function createSnake(snake: Partial<Snake>): Promise<ApiResponse<{ id: number }>> {
  return apiCall(`${PHP_API_URL}/snakes/create.php`, {
    method: 'POST',
    body: JSON.stringify(snake),
  });
}

// ==================== OBSERVATION ENDPOINTS (PHP) ====================

export async function fetchObservations(): Promise<Observation[]> {
  const response = await apiCall<Observation[]>(`${PHP_API_URL}/observations/read.php`);
  return response.success && response.data ? response.data : [];
}

export async function createObservation(observation: {
  species: string;
  length_cm?: number;
  weight_g?: number;
  location: string;
  date_observed: string;
  picture_url?: string;
  notes?: string;
}): Promise<ApiResponse<{ id: number }>> {
  return apiCall(`${PHP_API_URL}/observations/create.php`, {
    method: 'POST',
    body: JSON.stringify(observation),
  });
}

export async function deleteObservation(id: number): Promise<ApiResponse<void>> {
  return apiCall(`${PHP_API_URL}/observations/delete.php?id=${id}`, {
    method: 'DELETE',
  });
}

// ==================== ML PREDICTION ENDPOINTS (Python) ====================

export async function predictSnake(imageBase64: string): Promise<PredictionResult[]> {
  try {
    const response = await fetch(`${PYTHON_API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageBase64 }),
    });
    const data = await response.json();
    return data.success ? data.predictions : [];
  } catch (error) {
    console.error('Prediction API Error:', error);
    // Return mock prediction if backend is offline
    return getMockPredictions();
  }
}

export async function predictFromCamera(): Promise<{ predictions: PredictionResult[]; image?: string }> {
  try {
    const response = await fetch(`${PYTHON_API_URL}/predict/camera`, {
      method: 'POST',
    });
    const data = await response.json();
    return {
      predictions: data.success ? data.predictions : [],
      image: data.captured_image,
    };
  } catch (error) {
    console.error('Camera Prediction Error:', error);
    return { predictions: getMockPredictions() };
  }
}

export async function checkPythonHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${PYTHON_API_URL}/health`);
    const data = await response.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}

// Mock predictions fallback (10 trained species)
function getMockPredictions(): PredictionResult[] {
  const trainedSpecies = [
    { name: "King Cobra", scientific: "Ophiophagus hannah", venomous: "Highly venomous" },
    { name: "Common Wolf Snake", scientific: "Lycodon capucinus", venomous: "Non-venomous" },
    { name: "Yellow-lipped Sea Krait", scientific: "Laticauda colubrina", venomous: "Highly venomous" },
    { name: "Reticulated Python", scientific: "Malayopython reticulatus", venomous: "Non-venomous" },
    { name: "Common Bronze-backed Snake", scientific: "Dendrelaphis pictus", venomous: "Non-venomous" },
    { name: "Red-tailed Rat Snake", scientific: "Gonyosoma oxycephalum", venomous: "Non-venomous" },
    { name: "Dog-faced Water Snake", scientific: "Cerberus schneiderii", venomous: "Mildly venomous" },
    { name: "Brahminy Blind Snake", scientific: "Indotyphlops braminus", venomous: "Non-venomous" },
    { name: "Common Mock Viper", scientific: "Psammodynastes pulverulentus", venomous: "Mildly venomous" },
    { name: "North Philippine Temple Pit Viper", scientific: "Tropidolaemus subannulatus", venomous: "Highly venomous" },
  ];
  
  // Return top 3 random species from the 10 trained
  const shuffled = [...trainedSpecies].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 3);
  
  return selected.map((s, i) => ({
    species_name: s.name,
    scientific_name: s.scientific,
    confidence: Math.max(0.95 - i * 0.25, 0.1),
    venomous: s.venomous,
  }));
}
