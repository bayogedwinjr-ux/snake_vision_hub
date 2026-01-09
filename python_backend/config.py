"""
Configuration settings for Snake Vision Hub Python Backend
"""

import os
from pathlib import Path

# Base directory
BASE_DIR = Path(__file__).parent

# Model configuration
MODEL_CONFIG = {
    "path": BASE_DIR / "models" / "best_mobilenetv3_snakes.onnx",
    "input_size": (224, 224),
    "num_classes": 28,
    "normalize_mean": [0.485, 0.456, 0.406],
    "normalize_std": [0.229, 0.224, 0.225],
}

# Server configuration
SERVER_CONFIG = {
    "host": os.environ.get("HOST", "0.0.0.0"),
    "port": int(os.environ.get("PORT", 5000)),
    "debug": os.environ.get("DEBUG", "False").lower() == "true",
}

# Camera configuration (for Raspberry Pi)
CAMERA_CONFIG = {
    "device_id": 0,  # Default camera device
    "resolution": (640, 480),
    "fps": 30,
}

# CORS configuration
CORS_CONFIG = {
    "origins": [
        "http://localhost:*",
        "http://127.0.0.1:*",
        "https://*.lovable.app",
        "https://*.lovable.dev",
    ],
    "methods": ["GET", "POST", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
}
