# Snake Vision Hub - Python Backend

Flask API server for snake classification using the MobileNetV3 ONNX model.

## Setup on Raspberry Pi 5

### 1. Install Python dependencies
```bash
cd python_backend
pip install -r requirements.txt
```

### 2. Place the model file
Ensure `models/best_mobilenetv3_snakes.onnx` exists.

### 3. Run the server
```bash
python app.py
```

The server will start on `http://0.0.0.0:5000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Server health check |
| GET | `/classes` | List all 28 snake classes |
| POST | `/predict` | Classify uploaded image |
| POST | `/predict/camera` | Capture from Pi camera and classify |

## Usage Examples

### Predict from image file
```bash
curl -X POST -F "image=@snake.jpg" http://raspberrypi:5000/predict
```

### Predict from base64
```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{"image_base64": "data:image/jpeg;base64,..."}' \
  http://raspberrypi:5000/predict
```

## Camera Setup (Raspberry Pi)
```bash
# Enable camera
sudo raspi-config
# Navigate to Interface Options → Camera → Enable

# Install OpenCV
pip install opencv-python
```
