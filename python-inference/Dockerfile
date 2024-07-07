FROM python:3.10

WORKDIR /PyApp

RUN pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

COPY requirements.txt .

# Installa le dipendenze di sistema necessarie per OpenCV
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0

RUN pip install -r requirements.txt

# Crea la directory per i checkpoint di Torch (se non esiste già)
RUN mkdir -p /root/.cache/torch/hub/checkpoints

# Scarica i modelli necessari per il face detection e parsing
RUN wget -q https://github.com/elliottzheng/face-detection/releases/download/0.0.1/mobilenet0.25_Final.pth -O /root/.cache/torch/hub/checkpoints/mobilenet0.25_Final.pth \
    && wget -q https://github.com/FacePerceiver/facer/releases/download/models-v1/face_parsing.farl.lapa.main_ema_136500_jit191.pt -O /root/.cache/torch/hub/checkpoints/face_parsing.farl.lapa.main_ema_136500_jit191.pt

# Aggiungi ptvsd per il debug remoto
RUN pip install debugpy

COPY . .

EXPOSE 5000

CMD ["python", "src/server.py"]
