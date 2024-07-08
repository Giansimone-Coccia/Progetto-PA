"""
Module: zip_processing.py

This module provides functions for extracting and predicting images from a binary ZIP file.
"""

import zipfile
from io import BytesIO
from PIL import Image
from .image_processing import predict_image

def predict_zip_results(zip_data, model, class_names):
    """
    Extract images from a binary ZIP file and make predictions using the specified model.

    Args:
        zip_data (bytes): Binary ZIP file data.
        model (torch.nn.Module): Pre-trained model to use for classification.
        class_names (dict): A dictionary mapping class indices to class names.

    Returns:
        dict: A dictionary containing predictions for each image extracted from the ZIP file.
    """
    zip_results = {}

    with zipfile.ZipFile(BytesIO(zip_data), 'r') as zip_file:
        file_list = zip_file.namelist()

        for filename_zip in file_list:
            with zip_file.open(filename_zip) as file_in_zip:
                input_image = Image.open(file_in_zip)
                zip_results[filename_zip] = predict_image(input_image, model, class_names)

    return zip_results
