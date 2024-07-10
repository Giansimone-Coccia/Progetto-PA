"""
Module: zip_processing.py

This module provides functions for extracting and predicting images from a binary ZIP file.
"""

import zipfile
from io import BytesIO
from PIL import Image
from .image_processing import predict_image

def process_zip(zip_data, model, class_names):
    """
    Extract images from a binary ZIP file and make predictions using the specified model.

    Args:
        zip_data (bytes): Binary ZIP file data.
        model (torch.nn.Module or str): Pre-trained model to use for classification or 'clustering'.
        class_names (dict): A dictionary mapping class indices to class names.

    Returns:
        dict or list: A dictionary containing predictions for each image extracted from the ZIP file 
                      if model is not 'clustering', otherwise a list of image data for clustering.
    """
    results = [] if model == 'clustering' else {}
    
    with zipfile.ZipFile(BytesIO(zip_data), 'r') as zip_file:
        for filename_zip in zip_file.namelist():
            with zip_file.open(filename_zip) as file_in_zip:
                # Read the image data explicitly
                image_data = file_in_zip.read()
                
                # Use BytesIO to create a stream-like object for PIL
                image_stream = BytesIO(image_data)
                
                # Open the image from the stream
                input_image = Image.open(image_stream)
                
                if model == 'clustering':
                    results.append([filename_zip.split('/', 1)[-1], input_image])
                else:
                    results[filename_zip] = predict_image(input_image, model, class_names)

    return results
