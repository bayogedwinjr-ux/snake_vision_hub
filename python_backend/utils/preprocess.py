"""
Image preprocessing utilities for snake classification model.
"""

import numpy as np
from PIL import Image
from typing import Tuple


# ImageNet normalization values (used by MobileNetV3)
IMAGENET_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
IMAGENET_STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)


def resize_image(image: Image.Image, target_size: Tuple[int, int] = (224, 224)) -> Image.Image:
    """
    Resize image to target size while maintaining aspect ratio with center crop.
    
    Args:
        image: PIL Image object
        target_size: Tuple of (width, height)
        
    Returns:
        Resized PIL Image
    """
    # Get current size
    width, height = image.size
    target_w, target_h = target_size
    
    # Calculate aspect ratios
    aspect = width / height
    target_aspect = target_w / target_h
    
    if aspect > target_aspect:
        # Image is wider than target
        new_height = target_h
        new_width = int(target_h * aspect)
    else:
        # Image is taller than target
        new_width = target_w
        new_height = int(target_w / aspect)
    
    # Resize
    image = image.resize((new_width, new_height), Image.Resampling.LANCZOS)
    
    # Center crop
    left = (new_width - target_w) // 2
    top = (new_height - target_h) // 2
    right = left + target_w
    bottom = top + target_h
    
    return image.crop((left, top, right, bottom))


def normalize_image(img_array: np.ndarray) -> np.ndarray:
    """
    Normalize image array using ImageNet mean and std.
    
    Args:
        img_array: Numpy array of shape (H, W, C) with values in [0, 1]
        
    Returns:
        Normalized numpy array
    """
    return (img_array - IMAGENET_MEAN) / IMAGENET_STD


def preprocess_for_mobilenet(
    image: Image.Image,
    input_size: Tuple[int, int] = (224, 224)
) -> np.ndarray:
    """
    Complete preprocessing pipeline for MobileNetV3.
    
    Args:
        image: PIL Image object
        input_size: Model input size (width, height)
        
    Returns:
        Preprocessed numpy array ready for inference
        Shape: (1, 3, H, W) - NCHW format
    """
    # Convert to RGB
    if image.mode != 'RGB':
        image = image.convert('RGB')
    
    # Resize with center crop
    image = resize_image(image, input_size)
    
    # Convert to numpy array
    img_array = np.array(image, dtype=np.float32)
    
    # Normalize to [0, 1]
    img_array = img_array / 255.0
    
    # Apply ImageNet normalization
    img_array = normalize_image(img_array)
    
    # Convert to NCHW format (batch, channels, height, width)
    img_array = np.transpose(img_array, (2, 0, 1))
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
        List of (label, probability) tuples
    """
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
