import redis  # type: ignore
import os
import torch
import torchvision.transforms as transforms
from PIL import Image
from torchvision import models
import json

# Redis configuration
redis_host = os.getenv('REDIS_HOST', 'localhost')
redis_port = int(os.getenv('REDIS_PORT', 6379))

r = redis.Redis(host=redis_host, port=redis_port, db=0)

# Example of writing and reading from Redis
key = 'my_key'
value = 'Hello, Redis!'

# Write a value to the key 'my_key'
r.set(key, value)

# Read the value from the key 'my_key'
result = r.get(key)
print(f"Valore letto da Redis: {result.decode('utf-8')}")

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

# Function to perform inference on an image
def predict(image_path, class_names):
    # Load the image
    input_image = Image.open(image_path)
    input_tensor = preprocess(input_image)
    input_batch = input_tensor.unsqueeze(0)  # Create a mini-batch as expected by the model

    # Ensure the input tensor is on the same device as the model
    with torch.no_grad():
        output = model(input_batch)

    # The output has unnormalized scores. To get probabilities, you can run a softmax on it.
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
        print("Less than 5 classes in output, cannot perform top-5.")

    return json.dumps(results, indent=4)

# Example usage
image_path = "images/prova_volto.jpg"
result_json = predict(image_path, class_names_12)
print(result_json)
