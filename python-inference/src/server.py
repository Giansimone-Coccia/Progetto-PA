from io import BytesIO
import json
import logging
from flask import Flask, request, jsonify # type: ignore
import redis # type: ignore
import os
import torch
from PIL import Image
from utils.image_processing import predict_image
from utils.zip_processing import predict_zip_results
from cluster import clustering
from utils.video_processing import predict_video_results

app = Flask(__name__)

redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = int(os.getenv('REDIS_INTERNAL_PORT', 6379))

r = redis.Redis(host=redis_host, port=redis_port, db=0)

logging.basicConfig(level=logging.INFO)

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        '''try:
            clustering_instance = clustering.Clustering()
            result = clustering_instance.execute()
            return jsonify(result)
        except ValueError as ve:
            logging.error("ValueError occurred", exc_info=True)
            return jsonify({'error': str(ve)})
        except Exception as e:
            logging.error("Exception occurred", exc_info=True)
            return jsonify({'error': str(e)})'''
        all_results = {}
        try:
            data = request.json

            if data is None:
                return jsonify({'error': "Nessun dato JSON trovato", 'error_code': 400})

            jsonContents = data.get('jsonContents')
            modelId = data.get('modelId')

            model, class_names = modelType(modelId)

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
                    all_results[filename] = predict_image(input_image, model, class_names)

                elif type == 'zip':
                    zip_results = predict_zip_results(file_data, model, class_names)
                    all_results[filename] = zip_results

                elif type == 'video':
                    video_results = predict_video_results(file_data, model, class_names)
                    all_results[filename] = video_results

                else:
                    return jsonify({'error': f"Tipo non supportato: {type}", 'error_code': 400})

            return jsonify(all_results)

        except Exception as e:
            return jsonify({'error': str(e), 'error_code': 500})

    else:
        return jsonify({'error': 'Metodo non consentito', 'error_code': 405})
    
def modelType(modelId):
    base_path = os.path.dirname(__file__)  
    
    if modelId == "1":
        model_path = 'pyModels/armocromia_12_seasons_resnet50_full.pth'
        model = torch.load(model_path, map_location=torch.device('cpu'))
        model.eval()

        class_names_path = os.path.join(base_path, 'classes_json', 'class_names_12.json')
        with open(class_names_path, 'r') as f:
            class_names_12 = json.load(f)

        return model, class_names_12
    
    elif modelId == "2":
        model_path = 'pyModels/armocromia_4_seasons_resnet50_full.pth'
        model = torch.load(model_path, map_location=torch.device('cpu'))
        model.eval()

        class_names_path = os.path.join(base_path, 'classes_json', 'class_names_4.json')
        logging.info(class_names_path)
        with open(class_names_path, 'r') as f:
            class_names_4 = json.load(f)
        logging.info(class_names_4)

        return model, class_names_4
    
    elif modelId == "3":
        # clustering - Placeholder for future functionality
        return None
    else:
        raise ValueError(f"modelId not supported: {modelId}")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
