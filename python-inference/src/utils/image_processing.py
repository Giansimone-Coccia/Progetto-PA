import torchvision.transforms as transforms
import torch

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
    for i in range(probabilities.size(0)):
        class_name = class_names[str(i)]

        result_entry = {
            "probability": probabilities[i].item(),
            "class_name": class_name
        }

        results.append(result_entry)

    return results
