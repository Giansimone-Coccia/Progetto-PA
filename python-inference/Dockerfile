# Use the latest official PyTorch image as the base image
FROM pytorch/pytorch:latest

# Set the working directory inside the container to /PyApp
WORKDIR /PyApp

# Copy the requirements.txt file to the working directory
COPY requirements.txt .

# Install the necessary system dependencies for OpenCV, Git, and wget
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    git \
    wget

# Install the Python dependencies specified in requirements.txt
RUN pip install -r requirements.txt

# Create the directory for Torch checkpoints (if it does not already exist)
RUN mkdir -p /root/.cache/torch/hub/checkpoints

# Download the required models for face detection and parsing
RUN wget -q https://github.com/elliottzheng/face-detection/releases/download/0.0.1/mobilenet0.25_Final.pth -O /root/.cache/torch/hub/checkpoints/mobilenet0.25_Final.pth \
    && wget -q https://github.com/FacePerceiver/facer/releases/download/models-v1/face_parsing.farl.lapa.main_ema_136500_jit191.pt -O /root/.cache/torch/hub/checkpoints/face_parsing.farl.lapa.main_ema_136500_jit191.pt

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 5000 to the host
EXPOSE 5000

# Start the application by running the server script
CMD ["python", "src/server.py"]
