"""
Module implementing a Flask server for predicting based on JSON data.
"""

import os
from io import BytesIO
from http import HTTPStatus
from flask import Flask, request, jsonify # type: ignore
import redis
from dotenv import load_dotenv
from PIL import Image
from clustering.clustering import Clustering
from utils.image_processing import predict_image
from utils.zip_processing import process_zip
from utils.model_selection import select_model
from utils.video_processing import process_video
from error.error import CustomError
from error.error_messages import ErrorMessages

# Initialize Flask app
app = Flask(__name__)

# Load environment variables
load_dotenv()

# Configure max content length
max_content_length_str = os.getenv('MAX_CONTENT_LENGTH', '16')
app.config['MAX_CONTENT_LENGTH'] = eval(max_content_length_str) * 2

# Configure Redis connection
redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = int(os.getenv('REDIS_PORT', 6379))
r = redis.Redis(host=redis_host, port=redis_port, db=0)

@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint to predict based on the provided JSON data.
    Accepts 'image', 'zip', and 'video' file types.

    Returns:
        JSON response with prediction results or error messages.
    """
    if request.method == 'POST':
        try:
            data = request.json

            if data is None:
                raise CustomError(ErrorMessages.NO_JSON_DATA, HTTPStatus.BAD_REQUEST)

            json_contents = data.get('jsonContents')
            model_id = data.get('modelId')

            if not isinstance(json_contents, list):
                raise CustomError(ErrorMessages.JSON_CONTENTS_NOT_LIST, HTTPStatus.BAD_REQUEST)

            model, class_names = select_model(model_id)

            if not model:
                raise CustomError(ErrorMessages.INVALID_MODEL_ID, HTTPStatus.BAD_REQUEST)

            if model == "clustering":
                all_images = []
            else:
                all_results = {}

            for item in json_contents:
                if not isinstance(item, list) or len(item) != 3:
                    raise CustomError(ErrorMessages.INVALID_JSON_CONTENT, HTTPStatus.BAD_REQUEST)
                filename, file_type, file = item

                if not isinstance(file_type, str):
                    raise CustomError(ErrorMessages.INVALID_FILE_TYPE, HTTPStatus.BAD_REQUEST)

                if not isinstance(file, dict) \
                        or file.get('type') != 'Buffer' \
                        or not isinstance(file.get('data'), list):
                    raise CustomError(ErrorMessages.INVALID_BUFFER, HTTPStatus.BAD_REQUEST)

                file_data = bytes(file.get('data'))

                if file_type == 'image':
                    input_image = Image.open(BytesIO(file_data))
                    if model == 'clustering':
                        all_images.append([filename, input_image])
                    else:
                        all_results[filename] = predict_image(input_image, model, class_names)

                elif file_type == 'zip':
                    zip_data = process_zip(file_data, model, class_names)
                    if model == 'clustering':
                        all_images.extend([[f"{filename}/{name}", img] for name, img in zip_data])
                    else:
                        all_results[filename] = zip_data

                elif file_type == 'video':
                    video_data = process_video(file_data, model, class_names)
                    if model == 'clustering':
                        all_images.extend([[f"{filename}/{name}", img] for name, img in video_data])
                    else:
                        all_results[filename] = video_data

                else:
                    raise CustomError(f"{ErrorMessages.UNSUPPORTED_TYPE}: {file_type}", HTTPStatus.BAD_REQUEST)

            if model == 'clustering':
                clustering_instance = Clustering()
                result = clustering_instance.execute(all_images)

                if not result:
                    raise CustomError(ErrorMessages.DATASET_REQUIREMENT, HTTPStatus.BAD_REQUEST)

                return jsonify(result)
            else:
                return jsonify(all_results)

        except CustomError as e:
            return jsonify({'error': e.message, 'error_code': e.status_code})

        except Exception as e:
            return jsonify({'error': str(e), 'error_code': HTTPStatus.INTERNAL_SERVER_ERROR})

    return jsonify({'error': 'Method not allowed', 'error_code': HTTPStatus.METHOD_NOT_ALLOWED})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
