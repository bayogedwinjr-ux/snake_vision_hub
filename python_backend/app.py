"""
Snake Vision Hub - Python Backend
Flask API Server for ML Model Inference

This server provides endpoints for:
- Image-based snake species identification using MobileNetV3 ONNX model
- Camera capture and classification (for Raspberry Pi)
- Health check and class listing

Run: python app.py
"""

import os
import io
import base64
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image

# Try to import optional dependencies
try:
    import onnxruntime as ort
    ONNX_AVAILABLE = True
except ImportError:
    ONNX_AVAILABLE = False
    print("Warning: onnxruntime not installed. Model inference will use mock predictions.")

try:
    import cv2
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False
    print("Warning: opencv-python not installed. Camera capture will be disabled.")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Configuration
MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "best_mobilenetv3_snakes.onnx")
INPUT_SIZE = (224, 224)  # MobileNetV3 input size

# 28 Philippine Snake Species Labels (from CSV metadata)
LABELS = [
    "Asian Vine Snake",
    "Philippine Blunt-headed Tree Snake",
    "Dog-toothed Cat Snake",
    "Paradise Flying Tree Snake",
    "Common Bronze-backed Snake",
    "Philippine Whipsnake",
    "Grey Tailed Brown Rat Snake",
    "Red-tailed Rat Snake",
    "Common Wolf Snake",
    "Smooth-scaled Mountain Rat Snake",
    "Gervais' Worm Snake",
    "Northern Triangle-spotted Snake",
    "Non-banded Philippine Burrowing Snake",
    "Negros Light-scaled Burrowing Snake",
    "Dog-faced Water Snake",
    "Negros Spotted Water Snake",
    "Boie's Keelback Snake",
    "Yellow-lipped Sea Krait",
    "Double-barred Coral Snake",
    "Common Mock Viper",
    "North Philippine Temple Pit Viper",
    "Pit Viper",
    "Barred Coral Snake",
    "King Cobra",
    "Samar Cobra",
    "Reticulated Python",
    "Small Wart Snake",
    "Brahminy Blind Snake"
]

# Scientific names for each species
SCIENTIFIC_NAMES = [
    "Ahaetulla prasina preocularis",
    "Boiga angulata",
    "Boiga cynodon",
    "Chrysopelea paradisi variabilis",
    "Dendrelaphis pictus",
    "Dryophiops philippina",
    "Coelognathus erythrurus psephenourus",
    "Gonyosoma oxycephalum",
    "Lycodon capucinus",
    "Ptyas luzonensis",
    "Calamaria gervaisi iridescens",
    "Cyclocorus lineatus alcalai",
    "Oxyrhabdium modestum",
    "Pseudorabdion oxycephalum",
    "Cerberus schneiderii",
    "Tropidonophis negrosensis",
    "Rhabdophis spilogaster",
    "Laticauda colubrina",
    "Hemibungarus gemianulis",
    "Psammodynastes pulverulentus",
    "Tropidolaemus subannulatus",
    "Trimeresurus flavomaculatus",
    "Hemibungarus calligaster",
    "Ophiophagus hannah",
    "Naja Samarensis",
    "Malayopython reticulatus",
    "Acrochordus granulatus",
    "Indotyphlops braminus"
]

# Venom levels for each species
VENOM_LEVELS = [
    "Mildly venomous",
    "Mildly venomous",
    "Mildly venomous",
    "Mildly venomous",
    "Non-venomous",
    "Mildly venomous",
    "Non-venomous",
    "Non-venomous",
    "Non-venomous",
    "Non-venomous",
    "Non-venomous",
    "Non-venomous",
    "Non-venomous",
    "Non-venomous",
    "Mildly venomous",
    "Non-venomous",
    "Mildly venomous",
    "Highly venomous",
    "Highly venomous",
    "Mildly venomous",
    "Highly venomous",
    "Highly venomous",
    "Highly venomous",
    "Highly venomous",
    "Highly venomous",
    "Non-venomous",
    "Non-venomous",
    "Non-venomous"
]

# Load ONNX model
onnx_session = None
if ONNX_AVAILABLE and os.path.exists(MODEL_PATH):
    try:
        onnx_session = ort.InferenceSession(MODEL_PATH)
        logger.info(f"ONNX model loaded successfully from {MODEL_PATH}")
    except Exception as e:
        logger.error(f"Failed to load ONNX model: {e}")


def preprocess_image(image: Image.Image) -> np.ndarray:
    """
    Preprocess image for MobileNetV3 model input.
    
    Args:
        image: PIL Image object
        
    Returns:
        Preprocessed numpy array ready for model inference
    """
    # Convert to RGB if necessary
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize to model input size
    image = image.resize(INPUT_SIZE, Image.Resampling.LANCZOS)
    
    # Convert to numpy array and normalize
    img_array = np.array(image, dtype=np.float32)
    
    # Normalize to [0, 1]
    img_array = img_array / 255.0
    
    # ImageNet normalization (MobileNetV3 standard)
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    img_array = (img_array - mean) / std
    
    # Add batch dimension and transpose to NCHW format
    img_array = np.transpose(img_array, (2, 0, 1))
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array


def predict_with_model(image: Image.Image) -> list:
    """
    Run inference with the ONNX model.
    
    Args:
        image: PIL Image object
        
    Returns:
        List of top predictions with confidence scores
    """
    if onnx_session is None:
        # Return mock prediction if model not available
        return get_mock_predictions()
    
    try:
        # Preprocess image
        input_tensor = preprocess_image(image)
        
        # Get input name
        input_name = onnx_session.get_inputs()[0].name
        
        # Run inference
        outputs = onnx_session.run(None, {input_name: input_tensor})
        
        # Get probabilities (apply softmax if needed)
        logits = outputs[0][0]
        probabilities = softmax(logits)
        
        # Get top 5 predictions
        top_indices = np.argsort(probabilities)[::-1][:5]
        
        predictions = []
        for idx in top_indices:
            if idx < len(LABELS):
                predictions.append({
                    "species_name": LABELS[idx],
                    "scientific_name": SCIENTIFIC_NAMES[idx],
                    "confidence": float(probabilities[idx]),
                    "venomous": VENOM_LEVELS[idx]
                })
        
        return predictions
        
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        return get_mock_predictions()


def softmax(x):
    """Apply softmax function to convert logits to probabilities."""
    exp_x = np.exp(x - np.max(x))
    return exp_x / exp_x.sum()


def get_mock_predictions() -> list:
    """Return mock predictions for testing when model is not available."""
    import random
    
    # Select random species
    indices = random.sample(range(len(LABELS)), 3)
    
    # Generate random confidences that sum to ~1
    confidences = [random.uniform(0.5, 0.95)]
    confidences.append(random.uniform(0.1, 0.3))
    confidences.append(random.uniform(0.05, 0.15))
    
    predictions = []
    for i, idx in enumerate(indices):
        predictions.append({
            "species_name": LABELS[idx],
            "scientific_name": SCIENTIFIC_NAMES[idx],
            "confidence": confidences[i],
            "venomous": VENOM_LEVELS[idx]
        })
    
    return predictions


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "model_loaded": onnx_session is not None,
        "camera_available": CV2_AVAILABLE,
        "num_classes": len(LABELS)
    })


@app.route('/classes', methods=['GET'])
def get_classes():
    """Return list of all classifiable snake species."""
    classes = []
    for i in range(len(LABELS)):
        classes.append({
            "id": i,
            "common_name": LABELS[i],
            "scientific_name": SCIENTIFIC_NAMES[i],
            "venomous": VENOM_LEVELS[i]
        })
    return jsonify({
        "success": True,
        "count": len(classes),
        "data": classes
    })


@app.route('/predict', methods=['POST'])
def predict():
    """
    Classify snake species from uploaded image.
    
    Accepts:
    - multipart/form-data with 'image' file
    - application/json with 'image' as base64 string
    """
    try:
        image = None
        
        # Check for file upload
        if 'image' in request.files:
            file = request.files['image']
            image = Image.open(file.stream)
            
        # Check for base64 image in JSON
        elif request.is_json:
            data = request.get_json()
            if 'image' in data:
                # Remove data URL prefix if present
                image_data = data['image']
                if 'base64,' in image_data:
                    image_data = image_data.split('base64,')[1]
                
                image_bytes = base64.b64decode(image_data)
                image = Image.open(io.BytesIO(image_bytes))
        
        if image is None:
            return jsonify({
                "success": False,
                "message": "No image provided. Send as 'image' file or base64 in JSON."
            }), 400
        
        # Run prediction
        predictions = predict_with_model(image)
        
        return jsonify({
            "success": True,
            "predictions": predictions
        })
        
    except Exception as e:
        logger.error(f"Prediction endpoint error: {e}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


@app.route('/predict/camera', methods=['POST'])
def predict_camera():
    """
    Capture image from connected camera and classify.
    Only works on Raspberry Pi with connected camera.
    """
    if not CV2_AVAILABLE:
        return jsonify({
            "success": False,
            "message": "Camera not available. Install opencv-python."
        }), 503
    
    try:
        # Initialize camera
        camera = cv2.VideoCapture(0)
        
        if not camera.isOpened():
            return jsonify({
                "success": False,
                "message": "Could not open camera. Check connection."
            }), 503
        
        # Capture frame
        ret, frame = camera.read()
        camera.release()
        
        if not ret:
            return jsonify({
                "success": False,
                "message": "Failed to capture image from camera."
            }), 500
        
        # Convert BGR to RGB and to PIL Image
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        image = Image.fromarray(frame_rgb)
        
        # Run prediction
        predictions = predict_with_model(image)
        
        # Also return the captured image as base64
        buffer = io.BytesIO()
        image.save(buffer, format='JPEG')
        image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        return jsonify({
            "success": True,
            "predictions": predictions,
            "captured_image": f"data:image/jpeg;base64,{image_base64}"
        })
        
    except Exception as e:
        logger.error(f"Camera prediction error: {e}")
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False').lower() == 'true'
    
    logger.info(f"Starting Snake Vision Hub API on port {port}")
    logger.info(f"Model loaded: {onnx_session is not None}")
    logger.info(f"Camera available: {CV2_AVAILABLE}")
    logger.info(f"Number of classes: {len(LABELS)}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
