# Dockerfile for Python Inference
FROM python:3.10

# Set the working directory inside the container
WORKDIR /PyApp

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy inference code
COPY . .

# Expose port if needed
EXPOSE 5000

# Command to run the inference script
CMD ["python", "src/inference.py"]
