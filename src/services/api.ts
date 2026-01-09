// API Configuration
// Update these URLs to match your local servers

export const API_CONFIG = {
  // PHP Backend (WAMP Server)
  PHP_API_URL: import.meta.env.VITE_PHP_API_URL || 'http://localhost/snake_vision_hub/api',
  
  // Python Backend (Raspberry Pi)
  PYTHON_API_URL: import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:5000',
};

// Snake Types
export interface Snake {
  id: number;
  commonName: string;
  speciesName: string;
  venomous: 'Non-venomous' | 'Mildly venomous' | 'Highly venomous';
  status: string;
  distribution: string;
  habitat: string;
  description: string;
  ecologicalRole: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface Observation {
  id: string;
  snakeId?: number;
  species: string;
  length: number;
  weight?: number;
  location: string;
  dateObserved: string;
  pictureUrl?: string;
  notes?: string;
  createdAt: string;
}

export interface PredictionResult {
  species: string;
  confidence: number;
}

// PHP API - Snakes
export const snakeApi = {
  async getAll(): Promise<Snake[]> {
    const res = await fetch(`${API_CONFIG.PHP_API_URL}/snakes/read.php`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async getById(id: number): Promise<Snake> {
    const res = await fetch(`${API_CONFIG.PHP_API_URL}/snakes/read_single.php?id=${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async create(snake: Omit<Snake, 'id' | 'createdAt'>): Promise<number> {
    const res = await fetch(`${API_CONFIG.PHP_API_URL}/snakes/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snake),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.id;
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_CONFIG.PHP_API_URL}/snakes/delete.php?id=${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
  },
};

// PHP API - Observations
export const observationApi = {
  async getAll(): Promise<Observation[]> {
    const res = await fetch(`${API_CONFIG.PHP_API_URL}/observations/read.php`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async create(observation: Omit<Observation, 'id' | 'createdAt'>): Promise<Observation> {
    const res = await fetch(`${API_CONFIG.PHP_API_URL}/observations/create.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(observation),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`${API_CONFIG.PHP_API_URL}/observations/delete.php?id=${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
  },
};

// Python API - Predictions
export const predictionApi = {
  async predictFromBase64(imageBase64: string): Promise<PredictionResult[]> {
    const res = await fetch(`${API_CONFIG.PYTHON_API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_base64: imageBase64 }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return data.predictions;
  },

  async predictFromCamera(): Promise<{ predictions: PredictionResult[]; capturedImage: string }> {
    const res = await fetch(`${API_CONFIG.PYTHON_API_URL}/predict/camera`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return { predictions: data.predictions, capturedImage: data.captured_image };
  },

  async getClasses(): Promise<string[]> {
    const res = await fetch(`${API_CONFIG.PYTHON_API_URL}/classes`);
    const data = await res.json();
    return data.classes;
  },

  async healthCheck(): Promise<boolean> {
    try {
      const res = await fetch(`${API_CONFIG.PYTHON_API_URL}/health`);
      const data = await res.json();
      return data.status === 'healthy';
    } catch {
      return false;
    }
  },
};
