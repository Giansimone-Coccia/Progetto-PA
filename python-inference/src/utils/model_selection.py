import json
import os
import torch

def select_model(modelId):
    base_path = os.path.dirname(__file__)  
    
    if modelId == "1":
        model_path = os.path.join(base_path, '..', '..', 'pyModels', 'armocromia_12_seasons_resnet50_full.pth')
        model = torch.load(model_path, map_location=torch.device('cpu'))
        model.eval()

        class_names_path = os.path.join(base_path, '..', 'classes_json', 'class_names_12.json')
        with open(class_names_path, 'r') as f:
            class_names_12 = json.load(f)

        return model, class_names_12
    
    elif modelId == "2":
        model_path = os.path.join(base_path, '..', '..', 'pyModels', 'armocromia_4_seasons_resnet50_full.pth')
        model = torch.load(model_path, map_location=torch.device('cpu'))
        model.eval()

        class_names_path = os.path.join(base_path, '..', 'classes_json', 'class_names_4.json')
        with open(class_names_path, 'r') as f:
            class_names_4 = json.load(f)

        return model, class_names_4
    
    elif modelId == "3":
        # clustering - Placeholder for future functionality
        return None
    else:
        raise ValueError(f"modelId not supported: {modelId}")
