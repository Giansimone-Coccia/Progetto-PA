import json
import os
import torch

def select_model(model_Id):
    base_path = os.path.dirname(__file__)  
    
    if model_Id == "1":
        model_path = os.path.join(base_path, '..', '..', 'pyModels', 'armocromia_12_seasons_resnet50_full.pth')
        model = torch.load(model_path, map_location=torch.device('cpu'))
        model.eval()

        class_names_path = os.path.join(base_path, '..', 'classes_json', 'class_names_12.json')
        with open(class_names_path, 'r') as f:
            class_names_12 = json.load(f)

        return model, class_names_12
    
    elif model_Id == "2":
        model_path = os.path.join(base_path, '..', '..', 'pyModels', 'armocromia_4_seasons_resnet50_full.pth')
        model = torch.load(model_path, map_location=torch.device('cpu'))
        model.eval()

        class_names_path = os.path.join(base_path, '..', 'classes_json', 'class_names_4.json')
        with open(class_names_path, 'r') as f:
            class_names_4 = json.load(f)

        return model, class_names_4
    
    elif model_Id == "3":
        return "clustering", None   
    else:
        return None, None