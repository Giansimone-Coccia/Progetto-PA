import json
import logging
from flask import Flask, request, jsonify # type: ignore
import redis 
import os
from io import BytesIO

import redis # type: ignore
from flask import Flask, request, jsonify # type: ignore
from PIL import Image
from clustering.clustering import Clustering
from utils.image_processing import predict_image
from utils.zip_processing import process_zip
from utils.model_selection import select_model
from utils.video_processing import process_video

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 100*1024*1024*2


redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = int(os.getenv('REDIS_PORT', 6379))
r = redis.Redis(host=redis_host, port=redis_port, db=0)

logging.basicConfig(level=logging.INFO)

@app.route('/predict', methods=['POST'])
def predict():
    logging.info("Inizio codice python")
    if request.method == 'POST':
        try:
            data = request.json

            if data is None:
                return jsonify({'error': "Nessun dato JSON trovato", 'error_code': 400})

            jsonContents = data.get('jsonContents')
            model_id = data.get('modelId')

            if not isinstance(jsonContents, list):
                return jsonify({'error': "jsonContents deve essere una lista",'error_code': 400})
            
            model, class_names = select_model(model_id)

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


                if type == 'image':
                    input_image = Image.open(BytesIO(file_data))
                    if model == 'clustering' :  
                        all_images.append([filename, input_image])
                    else: 
                       all_results[filename] = predict_image(input_image, model, class_names)
                
                elif type == 'zip':
                    zip_data = process_zip(file_data, model, class_names)
                    if model == 'clustering' :
                        #all_images.extend(zip_data)
                        all_images.extend(list(map(lambda x: [f"{filename}/{x[0]}", x[1]], zip_data)))
                    else: 
                        all_results[filename] = zip_data

                elif type == 'video':
                    video_data = process_video(file_data, model, class_names)
                    if model == 'clustering' :
                        all_images.extend(list(map(lambda x: [f"{filename}/{x[0]}", x[1]], video_data)))
                    else:
                        all_results[filename] = video_data

                else:
                    return jsonify({'error': f"Tipo non supportato: {type}", 'error_code': 400})
                    
            if model == 'clustering' :
                if(len(all_images)>=12):
                    clustering_instance = Clustering()
                    return jsonify(clustering_instance.execute(all_images))
                else:
                    return jsonify({'error': f"Il dataset deve contenere almeno 12 immagini: il numero attuale di immagini è {len(all_images)}", 'error_code': 400})
            else:
                return jsonify(all_results)

        except Exception as e:
            logging.error("Exception occurred", exc_info=True)
            return jsonify({'error': str(e), 'error_code': 500})

    else:
        return jsonify({'error': 'Metodo non consentito', 'error_code': 405})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
