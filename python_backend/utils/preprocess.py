"""
Image preprocessing utilities for snake classification model.
Matches the preprocessing used during MobileNetV3 training.
"""

import numpy as np
from PIL import Image
from typing import Tuple


# Model input size (matches training configuration)
INPUT_SIZE = (320, 320)


def resize_image(image: Image.Image, target_size: Tuple[int, int] = INPUT_SIZE) -> Image.Image:
    """
    Resize image to target size.
    
    Args:
        image: PIL Image object
        target_size: Tuple of (width, height)
        
    Returns:
        Resized PIL Image
    """
    return image.resize(target_size, Image.Resampling.LANCZOS)


def preprocess_for_mobilenet(
    image: Image.Image,
    input_size: Tuple[int, int] = INPUT_SIZE
) -> np.ndarray:
    """
    Complete preprocessing pipeline for MobileNetV3.
    Matches the preprocessing used during training:
    - Resize to 320x320
    - Scale pixels to [-1, 1] range (MobileNetV3 preprocess_input)
    - Output in NHWC format (batch, height, width, channels)
    
    Args:
        image: PIL Image object
        input_size: Model input size (width, height)
        
    Returns:
        Preprocessed numpy array ready for inference
        Shape: (1, H, W, 3) - NHWC format for TensorFlow ONNX model
    """
    # Convert to RGB
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize to model input size
    image = image.resize(input_size, Image.Resampling.LANCZOS)
    
    # Convert to numpy array
    img_array = np.array(image, dtype=np.float32)
    
    # MobileNetV3 preprocessing: scale to [-1, 1]
    # This matches tf.keras.applications.mobilenet_v3.preprocess_input
    img_array = (img_array / 127.5) - 1.0
    
    # Add batch dimension (NHWC format for TensorFlow ONNX)
    img_array = np.expand_dims(img_array, axis=0)
    
    return img_array


def decode_predictions(
    probabilities: np.ndarray,
    labels: list,
    top_k: int = 5
) -> list:
    """
    Decode model output probabilities to class labels.
    
    Args:
        probabilities: Model output probabilities
        labels: List of class labels
        top_k: Number of top predictions to return
        
    Returns:
        List of prediction dictionaries
    """
    # Ensure we don't request more predictions than available classes
    top_k = min(top_k, len(labels), len(probabilities))
    
    # Get top k indices
    top_indices = np.argsort(probabilities)[::-1][:top_k]
    
    results = []
    for idx in top_indices:
        if idx < len(labels):
            results.append({
                "index": int(idx),
                "label": labels[idx],
                "probability": float(probabilities[idx])
            })
    
    return results
