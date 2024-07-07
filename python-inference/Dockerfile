FROM pytorch/pytorch:latest

WORKDIR /PyApp

COPY requirements.txt .

# Installa le dipendenze di sistema necessarie per OpenCV, Git e wget
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    git \
    wget

RUN pip install -r requirements.txt

# Crea la directory per i checkpoint di Torch (se non esiste già)
RUN mkdir -p /root/.cache/torch/hub/checkpoints

# Scarica i modelli necessari per il face detection e parsing
RUN wget -q https://github.com/elliottzheng/face-detection/releases/download/0.0.1/mobilenet0.25_Final.pth -O /root/.cache/torch/hub/checkpoints/mobilenet0.25_Final.pth \
    && wget -q https://github.com/FacePerceiver/facer/releases/download/models-v1/face_parsing.farl.lapa.main_ema_136500_jit191.pt -O /root/.cache/torch/hub/checkpoints/face_parsing.farl.lapa.main_ema_136500_jit191.pt

COPY . .

EXPOSE 5000

CMD ["python", "src/server.py"]
