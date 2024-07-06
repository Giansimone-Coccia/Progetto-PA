import logging
import zipfile
from io import BytesIO
from PIL import Image
from .image_processing import predict_image

logger = logging.getLogger(__name__)

def predict_zip_results(zip_data, model, class_names):
    zip_results = {}
    logger.info("1")

    with zipfile.ZipFile(BytesIO(zip_data), 'r') as zip_file:
        file_list = zip_file.namelist()
        logger.info("2")

        for filename_zip in file_list:
            logger.info("3")
            with zip_file.open(filename_zip) as file_in_zip:
                logger.info("4")
                input_image = Image.open(file_in_zip)
                logger.info("5")
                zip_results[filename_zip] = predict_image(input_image, model, class_names)
                logger.info("6")

    return zip_results
