"""
Snake Vision Hub - Python Backend
Flask API for snake classification using ONNX model
Designed for Raspberry Pi 5
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import onnxruntime as ort
from PIL import Image
import io
import base64
import os

app = Flask(__name__)
CORS(app)

# Snake class labels (28 Philippine species)
CLASS_LABELS = [
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
    "Gervais Worm Snake",
    "Northern Triangle-spotted Snake",
    "Non-banded Philippine Burrowing Snake",
    "Negros Light-scaled Burrowing Snake",
    "Dog-faced Water Snake",
    "Negros Spotted Water Snake",
    "Boies Keelback Snake",
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
    "Brahminy Blind Snake",
    "Cumings Blind Snake"
]

# Load ONNX model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'models', 'best_mobilenetv3_snakes.onnx')
session = None

def load_model():
    global session
    if os.path.exists(MODEL_PATH):
        session = ort.InferenceSession(MODEL_PATH)
        print(f"Model loaded from {MODEL_PATH}")
    else:
        print(f"Warning: Model not found at {MODEL_PATH}")

def preprocess_image(image_data):
    """Preprocess image for MobileNetV3 model"""
    img = Image.open(io.BytesIO(image_data)).convert('RGB')
    img = img.resize((224, 224))
    img_array = np.array(img).astype(np.float32)
    img_array = img_array / 255.0
    img_array = (img_array - [0.485, 0.456, 0.406]) / [0.229, 0.224, 0.225]
    img_array = np.transpose(img_array, (2, 0, 1))
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def predict(image_data):
    """Run prediction on image"""
    if session is None:
        return None, "Model not loaded"
    
    try:
        input_data = preprocess_image(image_data)
        input_name = session.get_inputs()[0].name
        outputs = session.run(None, {input_name: input_data})
        probabilities = outputs[0][0]
        
        # Apply softmax
        exp_scores = np.exp(probabilities - np.max(probabilities))
        probs = exp_scores / exp_scores.sum()
        
        # Get top 5 predictions
        top_indices = np.argsort(probs)[::-1][:5]
        predictions = []
        for idx in top_indices:
            if idx < len(CLASS_LABELS):
                predictions.append({
                    'species': CLASS_LABELS[idx],
                    'confidence': float(probs[idx])
                })
        
        return predictions, None
    except Exception as e:
        return None, str(e)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': session is not None,
        'classes_count': len(CLASS_LABELS)
    })

@app.route('/classes', methods=['GET'])
def get_classes():
    return jsonify({
        'success': True,
        'classes': CLASS_LABELS,
        'count': len(CLASS_LABELS)
    })

@app.route('/predict', methods=['POST'])
def predict_image():
    """Predict snake species from uploaded image"""
    if 'image' not in request.files and 'image_base64' not in request.json if request.is_json else True:
        # Check for base64 in JSON body
        if request.is_json and 'image_base64' in request.json:
            base64_data = request.json['image_base64']
            if ',' in base64_data:
                base64_data = base64_data.split(',')[1]
            image_data = base64.b64decode(base64_data)
        else:
            return jsonify({'success': False, 'error': 'No image provided'}), 400
    else:
        file = request.files['image']
        image_data = file.read()
    
    predictions, error = predict(image_data)
    
    if error:
        return jsonify({'success': False, 'error': error}), 500
    
    return jsonify({
        'success': True,
        'predictions': predictions,
        'top_prediction': predictions[0] if predictions else None
    })

@app.route('/predict/camera', methods=['POST'])
def predict_camera():
    """Capture from camera and predict (for Raspberry Pi)"""
    try:
        import cv2
        cap = cv2.VideoCapture(0)
        ret, frame = cap.read()
        cap.release()
        
        if not ret:
            return jsonify({'success': False, 'error': 'Failed to capture from camera'}), 500
        
        _, buffer = cv2.imencode('.jpg', frame)
        image_data = buffer.tobytes()
        
        predictions, error = predict(image_data)
        
        if error:
            return jsonify({'success': False, 'error': error}), 500
        
        # Include captured image as base64
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        return jsonify({
            'success': True,
            'predictions': predictions,
            'top_prediction': predictions[0] if predictions else None,
            'captured_image': f'data:image/jpeg;base64,{image_base64}'
        })
    except ImportError:
        return jsonify({'success': False, 'error': 'OpenCV not installed'}), 500
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    load_model()
    app.run(host='0.0.0.0', port=5000, debug=True)
