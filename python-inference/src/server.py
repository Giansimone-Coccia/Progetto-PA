import logging
import os
from io import BytesIO
from flask import Flask, request, jsonify
import redis
from dotenv import load_dotenv
from PIL import Image
from clustering.clustering import Clustering
from utils.image_processing import predict_image
from utils.zip_processing import process_zip
from utils.model_selection import select_model
from utils.video_processing import process_video

# Initialize Flask app
app = Flask(__name__)

# Load environment variables
load_dotenv()

# Configure max content length
max_content_length_str = os.getenv('MAX_CONTENT_LENGTH', '16')
app.config['MAX_CONTENT_LENGTH'] = int(max_content_length_str) * 1024 * 1024

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
                return jsonify({'error': "No JSON data found", 'error_code': 400})

            json_contents = data.get('jsonContents')
            model_id = data.get('modelId')

            if not isinstance(json_contents, list):
                return jsonify({'error': "jsonContents must be a list", 'error_code': 400})

            model, class_names = select_model(model_id)

            if not model:
                return jsonify({'error': "Invalid modelId provided", 'error_code': 400})

            if model == "clustering":
                all_images = []
            else:
                all_results = {}

            for item in json_contents:
                if not isinstance(item, list) or len(item) != 3:
                    return jsonify({'error': "Each element in jsonContents must be a list "
                        "with three elements", 'error_code': 400})
                filename, file_type, file = item

                if not isinstance(file_type, str):
                    return jsonify({'error': "The file type must be a string", 'error_code': 400})

                if not isinstance(file, dict) \
                        or file.get('type') != 'Buffer' \
                        or not isinstance(file.get('data'), list):
                    return jsonify({'error': "The file must be a valid Buffer", 'error_code': 400})

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
                    return jsonify({'error': f"Unsupported type: {file_type}", 'error_code': 400})

            if model == 'clustering':
                clustering_instance = Clustering()
                result = clustering_instance.execute(all_images)

                if not result:
                    return jsonify({'error': "The dataset must contain images with "
                                    "at least 12 faces", 'error_code': 400})

                return jsonify(result)
            else:
                return jsonify(all_results)

        except Exception as e:
            logging.error("Exception occurred", exc_info=True)
            return jsonify({'error': str(e), 'error_code': 500})

    return jsonify({'error': 'Method not allowed', 'error_code': 405})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
