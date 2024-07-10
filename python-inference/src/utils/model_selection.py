"""
Module: model_selection.py

This module provides a function to select and load models based on the given model ID.
"""

import json
import os
import torch

def select_model(model_id):
    """
    Select and load a model based on the given model ID.

    Args:
        model_id (str): The ID of the model to load. 
                        "1" loads the 12-seasons model.
                        "2" loads the 4-seasons model.
                        "3" selects the clustering model.
    
    Returns:
        tuple: A tuple containing the model and the class names.
               If the model is 'clustering', returns ('clustering', None).
               If the model_id is invalid, returns (None, None).
    """
    base_path = os.path.dirname(__file__)

    if model_id == "1":
        model_path = os.path.join(base_path, '..', '..',
                                  'py_models', 'armocromia_12_seasons_resnet50_full.pth')
        model = torch.load(model_path, map_location=torch.device('cpu'))
        model.eval()

        class_names_path = os.path.join(base_path, '..', 'classes_json', 'class_names_12.json')
        with open(class_names_path, 'r', encoding='utf-8') as f:
            class_names_12 = json.load(f)

        return model, class_names_12

    if model_id == "2":
        model_path = os.path.join(base_path, '..', '..',
                                  'py_models', 'armocromia_4_seasons_resnet50_full.pth')
        model = torch.load(model_path, map_location=torch.device('cpu'))
        model.eval()

        class_names_path = os.path.join(base_path, '..', 'classes_json', 'class_names_4.json')
        with open(class_names_path, 'r', encoding='utf-8') as f:
            class_names_4 = json.load(f)

        return model, class_names_4

    if model_id == "3":
        return "clustering", None

    return None, None
