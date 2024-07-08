"""
Module: zip_processing.py

This module provides functions for extracting and predicting images from a binary ZIP file.
"""

import zipfile
from io import BytesIO
from PIL import Image
from .image_processing import predict_image


def process_zip(zip_data, model, class_names):
    results = [] if model == 'clustering' else {}
    """
    Extract images from a binary ZIP file and make predictions using the specified model.

    Args:
        zip_data (bytes): Binary ZIP file data.
        model (torch.nn.Module): Pre-trained model to use for classification.
        class_names (dict): A dictionary mapping class indices to class names.

    Returns:
        dict: A dictionary containing predictions for each image extracted from the ZIP file.
    """
    
    with zipfile.ZipFile(BytesIO(zip_data), 'r') as zip_file:
        for filename_zip in zip_file.namelist():
            with zip_file.open(filename_zip) as file_in_zip:
                input_image = Image.open(file_in_zip)
                if model == 'clustering':
                    results.append([filename_zip, input_image])
                else:
                    results[filename_zip] = predict_image(input_image, model, class_names)

    return results
