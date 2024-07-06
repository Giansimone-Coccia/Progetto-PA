import torchvision.transforms as transforms
import torch
from flask import jsonify # type: ignore

def predict_image(input_image, model, class_names):
    preprocess = transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    input_tensor = preprocess(input_image)
    input_batch = input_tensor.unsqueeze(0)

    with torch.no_grad():
        output = model(input_batch)

    probabilities = torch.nn.functional.softmax(output[0], dim=0)

    results = []
    if probabilities.size(0) >= 5:
        top5_prob, top5_catid = torch.topk(probabilities, 5)
        for i in range(top5_prob.size(0)):
            class_name = class_names[top5_catid[i].item()]
            result_entry = {
                "probability": top5_prob[i].item(),
                "class_name": class_name
            }
            results.append(result_entry)
    else:
        return jsonify({'error': 'Less than 5 classes in output, cannot perform top-5','error_code': 400})

    return results
