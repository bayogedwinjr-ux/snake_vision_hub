# Snake Vision Hub - Python Backend

## Overview

Flask API server for snake species identification using a MobileNetV3 ONNX model trained on 28 Philippine snake species.

## Setup Instructions

### 1. Install Python
Ensure Python 3.9+ is installed:
```bash
python --version
```

### 2. Create Virtual Environment (Recommended)
```bash
cd python_backend
python -m venv venv

# Activate on Windows
venv\Scripts\activate

# Activate on Linux/macOS/Raspberry Pi
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Server
```bash
python app.py
```

The server will start on `http://localhost:5000`

## Raspberry Pi 5 Setup

### Camera Setup
1. Enable camera in Raspberry Pi configuration:
```bash
sudo raspi-config
# Navigate to: Interface Options → Camera → Enable
```

2. Install camera libraries:
```bash
sudo apt update
sudo apt install python3-opencv
```

### Firewall Configuration
Allow port 5000 through the firewall:
```bash
sudo ufw allow 5000
```

### Run as Service (Optional)
Create a systemd service for auto-start:

```bash
sudo nano /etc/systemd/system/snake-vision.service
```

```ini
[Unit]
Description=Snake Vision Hub API
After=network.target

[Service]
User=pi
WorkingDirectory=/home/pi/snake_vision_hub/python_backend
ExecStart=/home/pi/snake_vision_hub/python_backend/venv/bin/python app.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable snake-vision
sudo systemctl start snake-vision
```

## API Endpoints

### Health Check
```
GET /health
```
Returns server status, model availability, and camera status.

### Get Classes
```
GET /classes
```
Returns list of all 28 classifiable snake species.

### Predict (Image Upload)
```
POST /predict
Content-Type: multipart/form-data

Form data:
- image: (file) Image file to classify
```

### Predict (Base64)
```
POST /predict
Content-Type: application/json

{
  "image": "data:image/jpeg;base64,..."
}
```

### Predict from Camera
```
POST /predict/camera
```
Captures image from connected camera and returns predictions.

## Response Format

### Prediction Response
```json
{
  "success": true,
  "predictions": [
    {
      "species_name": "King Cobra",
      "scientific_name": "Ophiophagus hannah",
      "confidence": 0.89,
      "venomous": "Highly venomous"
    },
    {
      "species_name": "Samar Cobra",
      "scientific_name": "Naja Samarensis",
      "confidence": 0.07,
      "venomous": "Highly venomous"
    }
  ]
}
```

## Model Information

- **Architecture**: MobileNetV3Large
- **Format**: ONNX (converted from TensorFlow/Keras)
- **Input Size**: 320x320 RGB
- **Classes**: 10 Philippine snake species
- **Weights File**: `models/best_mobilenetv3_snakes.onnx`
- **Preprocessing**: Scale pixels to [-1, 1] (MobileNetV3 preprocess_input)
- **Input Format**: NHWC (batch, height, width, channels)

### Trained Species (10 classes)

| Index | Scientific Name | Common Name | Venomous |
|-------|----------------|-------------|----------|
| 0 | Cerberus schneiderii | Dog-faced Water Snake | Mildly venomous |
| 1 | Dendrelaphis pictus | Common Bronze-backed Snake | Non-venomous |
| 2 | Gonyosoma oxycephalum | Red-tailed Rat Snake | Non-venomous |
| 3 | Indotyphlops braminus | Brahminy Blind Snake | Non-venomous |
| 4 | Laticauda colubrina | Yellow-lipped Sea Krait | Highly venomous |
| 5 | Lycodon capucinus | Common Wolf Snake | Non-venomous |
| 6 | Malayopython reticulatus | Reticulated Python | Non-venomous |
| 7 | Ophiophagus hannah | King Cobra | Highly venomous |
| 8 | Psammodynastes pulverulentus | Common Mock Viper | Mildly venomous |
| 9 | Tropidolaemus subannulatus | North Philippine Temple Pit Viper | Highly venomous |

**Note**: The Glossary page displays 28 species for educational purposes, but the AI model can only identify the 10 species listed above.

## Troubleshooting

### "Model not loaded" warning
- Ensure `best_mobilenetv3_snakes.onnx` exists in `models/` directory
- Check onnxruntime is installed: `pip install onnxruntime`

### Camera not working
- Check camera is connected and enabled
- Try: `libcamera-hello` on Raspberry Pi
- Install opencv: `pip install opencv-python`

### CORS errors
- The server allows all origins by default
- For production, configure specific origins in `config.py`
