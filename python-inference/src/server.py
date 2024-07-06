import logging
import zipfile
from flask import Flask, request, jsonify # type: ignore
import redis # type: ignore
import os
import torch
import torchvision.transforms as transforms
from PIL import Image
from torchvision import models
import os
from io import BytesIO

app = Flask(__name__)

# Redis configuration
redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = int(os.getenv('REDIS_PORT', 6379))

r = redis.Redis(host=redis_host, port=redis_port, db=0)

# Load the entire model
model_path = 'pyModels/armocromia_12_seasons_resnet50_full.pth'
model = torch.load(model_path, map_location=torch.device('cpu'))

# Put the model in evaluation mode
model.eval()

# Define a transformation to pre-process the images
preprocess = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
])

# Define the class names map
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

# Configura il logger
logging.basicConfig(level=logging.INFO)

@app.route('/predict', methods=['POST'])
def predict():
    app.logger.info("Request method: %s", request.method)

    if request.method == 'POST':
        all_results = {}
        try:
            data = request.json

            # Controllo che data non sia None
            if data is None:
                return jsonify({'error': "Nessun dato JSON trovato"})

            jsonContents = data.get('jsonContents')
            modelId = data.get('modelId') 

            # Controllo che jsonContents sia una lista
            if not isinstance(jsonContents, list):
                return jsonify({'error': "jsonContents deve essere una lista"})
            
            for item in jsonContents:

                if not isinstance(item, list) or len(item) != 3:
                    return jsonify({'error': "Ogni elemento di jsonContents deve essere una lista con due elementi"})

                app.logger.info("4")

                filename = item[0]
                type = item[1] 
                file = item[2] 

                if not isinstance(type, str):
                    return jsonify({'error': "Il type deve essere una stringa"})
                
                app.logger.info(isinstance(file, bytes))

                if not isinstance(file, dict) or file.get('type') != 'Buffer' or not isinstance(file.get('data'), list):
                    return jsonify({'error': "Il file deve essere un Buffer valido"})

                file = bytes(file.get('data'))

                if type == 'image':
                    input_image = Image.open(BytesIO(file))
                    all_results[filename] = predict_image(input_image, model, class_names_12)
                
                elif type == 'zip':
                    zip_results = {}

                    with zipfile.ZipFile(BytesIO(file), 'r') as zip_file:
                        file_list = zip_file.namelist()

                        for filename_zip in file_list:
                            with zip_file.open(filename_zip) as file_in_zip:
                                zip_results[filename_zip] = predict_image(file_in_zip, model, class_names_12)

                    all_results[filename] = zip_results
                else:
                    return jsonify({'error': f"Tipo non supportato: {type}"})

            return jsonify(all_results)
        except Exception as e:
            return jsonify({'error': str(e)})
    else:
        return jsonify({'error': 'Metodo non consentito'})


def predict_image(input_image, model, class_names_12):
    input_tensor = preprocess(input_image)
    input_batch = input_tensor.unsqueeze(0)
    
    with torch.no_grad():
        output = model(input_batch)
    
    probabilities = torch.nn.functional.softmax(output[0], dim=0)
    
    results = []
    if probabilities.size(0) >= 5:
        top5_prob, top5_catid = torch.topk(probabilities, 5)
        for i in range(top5_prob.size(0)):
            class_name = class_names_12[top5_catid[i].item()]
            result_entry = {
                "probability": top5_prob[i].item(),
                "class_name": class_name
            }
            results.append(result_entry)
    else:
        return {'error': 'Less than 5 classes in output, cannot perform top-5'}, 500
    
    return results

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
