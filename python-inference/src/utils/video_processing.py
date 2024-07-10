"""
Module: video_processing.py

This module provides functions for video processing and prediction using a pre-trained model.
"""

import tempfile
from PIL import Image
import cv2
from .image_processing import predict_image

def process_video(video_data, model, class_names):
    """
    Preprocess video frames, make predictions using the specified model,
    and return the probabilities of each class for each frame.

    Args:
        video_data (bytes): Binary video data.
        model (torch.nn.Module): Pre-trained model to use for classification.
        class_names (dict): A dictionary mapping class indices to class names.

    Returns:
        dict: A dictionary containing predictions for each frame of the video.
    """
    results = [] if model == 'clustering' else {}

    with tempfile.NamedTemporaryFile(suffix='.mp4') as video_file:
        video_file.write(video_data)
        video_file.flush()

        video = cv2.VideoCapture(video_file.name)
        frame_number = 0

        while True:
            ret, frame = video.read()

            if not ret:
                break

            image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

            if model == 'clustering':
                results.append([f"frame_{frame_number}", image])
            else:
                prediction = predict_image(image, model, class_names)
                results[f"frame_{frame_number}"] = prediction 

            frame_number += 1

        video.release()

    return results
