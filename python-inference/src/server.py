from io import BytesIO
import logging
from flask import Flask, request, jsonify # type: ignore
import redis
import os
import torch
from PIL import Image
from utils.image_processing import predict_image
from utils.zip_processing import predict_zip_results
from utils.video_processing import predict_video_results

app = Flask(__name__)

# Redis configuration
redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = int(os.getenv('REDIS_PORT', 6379))

r = redis.Redis(host=redis_host, port=redis_port, db=0)

# Load the entire model
model_path = 'pyModels/armocromia_12_seasons_resnet50_full.pth'
model = torch.load(model_path, map_location=torch.device('cpu'))
model.eval()

class_names_12 = {
    0: "autunno deep",
    1: "autunno soft",
    2: "autunno warm",
    3: "inverno bright",
    4: "inverno cool",
    5: "inverno deep",
    6: "primavera bright",
    7: "primavera light",
    8: "primavera warm",
    9: "summer cool",
    10: "summer light",
    11: "summer soft"
}

class_names_4 = {
    0: "autunno",
    1: "estate",
    2: "inverno",
    3: "primavera"
}

# Configure the logger
logging.basicConfig(level=logging.INFO)

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        all_results = {}
        try:
            data = request.json

            if data is None:
                return jsonify({'error': "Nessun dato JSON trovato", 'error_code': 400})

            jsonContents = data.get('jsonContents')
            modelId = data.get('modelId')

            if not isinstance(jsonContents, list):
                return jsonify({'error': "jsonContents deve essere una lista",'error_code': 400})

            for item in jsonContents:
                if not isinstance(item, list) or len(item) != 3:
                    return jsonify({'error': "Ogni elemento di jsonContents deve essere una lista con tre elementi",'error_code': 400})

                filename = item[0]
                type = item[1]
                file = item[2]

                if not isinstance(type, str):
                    return jsonify({'error': "Il type deve essere una stringa",'error_code': 400})

                if not isinstance(file, dict) or file.get('type') != 'Buffer' or not isinstance(file.get('data'), list):
                    return jsonify({'error': "Il file deve essere un Buffer valido", 'error_code': 400})

                file_data = bytes(file.get('data'))

                if type == 'image':
                    input_image = Image.open(BytesIO(file_data))
                    all_results[filename] = predict_image(input_image, model, class_names_12)

                elif type == 'zip':
                    zip_results = predict_zip_results(file_data, model, class_names_12)
                    all_results[filename] = zip_results

                elif type == 'video':
                    video_results = predict_video_results(file_data, model, class_names_12)
                    all_results[filename] = video_results

                else:
                    return jsonify({'error': f"Tipo non supportato: {type}", 'error_code': 400})

            return jsonify(all_results)

        except Exception as e:
            return jsonify({'error': str(e), 'error_code': 500})

    else:
        return jsonify({'error': 'Metodo non consentito', 'error_code': 405})



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
