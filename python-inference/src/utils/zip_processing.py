import logging
import zipfile
from io import BytesIO
from PIL import Image, UnidentifiedImageError
from .image_processing import predict_image
from utils.video_processing import process_video
import mimetypes

logging.basicConfig(level=logging.INFO)

def process_zip(zip_data, model, class_names):
    """
    Extracts images from a binary ZIP file and makes predictions using the specified model.

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
                # Explicitly read file data
                file_data = file_in_zip.read()

                # Determine file type based on extension
                mime_type, _ = mimetypes.guess_type(filename_zip)

                if mime_type and mime_type.startswith('video'):
                    # Use BytesIO to create a stream-like object
                    file_stream = bytes(file_data)
                    if model == 'clustering':
                        video_results = process_video(file_stream, model, class_names)
                        results.extend([[f"{filename_zip.split('/', 1)[-1]}/{name}", img] for name, img in video_results])
                    else:
                        results[filename_zip.split('/', 1)[-1]] = process_video(file_stream, model, class_names)
                elif mime_type and mime_type.startswith('image'):
                    # Use BytesIO to create a stream-like object
                    file_stream = BytesIO(file_data)
                    # Try to open the file as an image
                    try:
                        input_image = Image.open(file_stream)
                        if model == 'clustering':
                            results.append([filename_zip.split('/', 1)[-1], input_image])
                        else:
                            results[filename_zip.split('/', 1)[-1]] = predict_image(input_image, model, class_names)
                    except UnidentifiedImageError:
                        logging.error(f"Unable to identify the image: {filename_zip}")

    return results
