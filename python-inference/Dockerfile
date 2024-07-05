# Use an official Python runtime as a parent image
FROM python:3.10

# Set the working directory inside the container
WORKDIR /PyApp

# Install PyTorch (torchvision included) as per your specific version requirements
RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Install other Python dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy the rest of your application code
COPY . .

# Expose port if needed (you may not need to expose a port for PyTorch unless you have a web interface)
EXPOSE 5000

# Command to run the inference script or your main application
CMD ["python"]
