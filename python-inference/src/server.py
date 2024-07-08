import json
import logging
from flask import Flask, request, jsonify # type: ignore
import redis 
import os
from io import BytesIO

import redis # type: ignore
import torch
from flask import Flask, request, jsonify # type: ignore
from PIL import Image
from cluster.clustering import Clustering
from utils.image_processing import predict_image
from utils.zip_processing import process_zip
from utils.model_selection import select_model
from utils.video_processing import process_video

app = Flask(__name__)

redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = int(os.getenv('REDIS_PORT', 6379))
r = redis.Redis(host=redis_host, port=redis_port, db=0)

logging.basicConfig(level=logging.INFO)

@app.route('/predict', methods=['POST'])
def predict():
    """Endpoint per predire i risultati basati su vari tipi di file."""
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
        try:
            data = request.json

            if data is None:
                return jsonify({'error': "Nessun dato JSON trovato", 'error_code': 400})

            jsonContents = data.get('jsonContents')
            model_id = data.get('modelId')

            if not isinstance(jsonContents, list):
                return jsonify({'error': "jsonContents deve essere una lista",'error_code': 400})
            
            model, class_names = select_model(model_id)

            logging.info(model)
            logging.info(model == "clustering")
            logging.info(not model)

            if (not model):
                return jsonify({'error': "Inserito modelId errato",'error_code': 400})

            if model == "clustering":
                all_images = []
            else:
                all_results = {}

            for item in jsonContents:
                if not isinstance(item, list) or len(item) != 3:
                    return jsonify({'error': "Ogni elemento di jsonContents deve essere una lista con tre elementi",
                                    'error_code': 400})

                filename, type, file = item

                if not isinstance(type, str):
                    return jsonify({'error': "Il type deve essere una stringa",'error_code': 400})

                if not isinstance(file, dict) or file.get('type') != 'Buffer' or not isinstance(file.get('data'), list):
                    return jsonify({'error': "Il file deve essere un Buffer valido", 'error_code': 400})

                file_data = bytes(file.get('data'))

                logging.info('image')

                if type == 'image':
                    input_image = Image.open(BytesIO(file_data))
                    if model == 'clustering' :  
                        all_images.append([filename, input_image])
                        logging.info("in image")
                    else: 
                       all_results[filename] = predict_image(input_image, model, class_names)
                       logging.info(all_results)
                
                elif type == 'zip':
                    zip_data = process_zip(file_data, model, class_names)
                    if model == 'clustering' :
                        all_images.extend(zip_data)
                        logging.info('in zip')
                    else: 
                        all_results[filename] = zip_data
                        logging.info(all_results)

                elif type == 'video':
                    video_data = process_video(file_data, model, class_names)
                    if model == 'clustering' : 
                        all_images.extend(video_data)
                        logging.info("in video")
                    else:
                        all_results[filename] = video_data
                        logging.info(all_results)

                else:
                    return jsonify({'error': f"Tipo non supportato: {type}", 'error_code': 400})
                    
            if model == 'clustering' :
                array = []
                for coppia in all_images:
                    return

                #return Clustering.execute(all_images)
            else:
                return jsonify(all_results)

        except Exception as e:
            logging.error("Exception occurred", exc_info=True)
            return jsonify({'error': str(e), 'error_code': 500})

    else:
        return jsonify({'error': 'Metodo non consentito', 'error_code': 405})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
