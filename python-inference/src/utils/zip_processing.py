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
    Extracts images and videos from a binary ZIP file, including nested ZIP files, 
    and makes predictions using the specified model.

    Args:
        zip_data (bytes): Binary ZIP file data.
        model (torch.nn.Module or str): Pre-trained model to use for classification or 'clustering'.
        class_names (dict): A dictionary mapping class indices to class names.

    Returns:
        dict or list: A dictionary containing predictions for 
        each image or video extracted from the ZIP file 
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

                file_zip_splitted = filename_zip.split('/', 1)[-1]

                if mime_type and mime_type.startswith('video'):
                    # Use BytesIO to create a stream-like object
                    file_stream = bytes(file_data)
                    if model == 'clustering':
                        video_results = process_video(file_stream, model, class_names)
                        results.extend([[f"{file_zip_splitted}/{name}", img] for name,
                                        img in video_results])
                    else:
                        results[file_zip_splitted] = process_video(file_stream,
                                                                   model, class_names)

                elif mime_type and mime_type.startswith('image'):
                    # Check if the image type is JPEG or PNG
                    if mime_type == 'image/jpeg' or mime_type == 'image/png':
                        # Use BytesIO to create a stream-like object
                        file_stream = BytesIO(file_data)
                        try:
                            input_image = Image.open(file_stream)
                            if model == 'clustering':
                                results.append([file_zip_splitted, input_image])
                            else:
                                results[file_zip_splitted] = predict_image(input_image,
                                                                           model, class_names)
                        except UnidentifiedImageError:
                            logging.error(f"Unable to identify the image: {filename_zip}")

                elif mime_type and mime_type == 'application/zip':
                    # Process nested zip files
                    nested_results = process_zip(file_data, model, class_names)
                    if model == 'clustering':
                        results.extend([f"{file_zip_splitted}/{name}", img] for name,
                                        img in nested_results)
                    else:
                        results[file_zip_splitted] = nested_results

    return results
