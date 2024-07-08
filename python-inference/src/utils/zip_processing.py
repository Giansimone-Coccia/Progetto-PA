import zipfile
from io import BytesIO
from PIL import Image
from .image_processing import predict_image


def process_zip(zip_data, model, class_names):
    results = [] if model == 'clustering' else {}

    with zipfile.ZipFile(BytesIO(zip_data), 'r') as zip_file:
        for filename_zip in zip_file.namelist():
            with zip_file.open(filename_zip) as file_in_zip:
                input_image = Image.open(file_in_zip)
                if model == 'clustering':
                    results.append([filename_zip, input_image])
                else:
                    results[filename_zip] = predict_image(input_image, model, class_names)

    return results
