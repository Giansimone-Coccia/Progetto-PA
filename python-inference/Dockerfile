# Dockerfile for Python Inference
FROM python:3.10

# Install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy inference code
COPY . .

# Expose port if needed
EXPOSE 5000

# Command to run the inference script
CMD ["python", "inference.py"]
