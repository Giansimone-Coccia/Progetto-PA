import tempfile
from PIL import Image
import cv2
from .image_processing import predict_image

def predict_video_results(video_data, model, class_names):
    video_results = {}

    # Salva i byte del video in un file temporaneo
    with tempfile.NamedTemporaryFile(suffix='.mp4') as video_file:
        video_file.write(video_data)
        video_file.flush()

        # Apri il video con OpenCV
        video = cv2.VideoCapture(video_file.name)

        # Inizializza il conteggio dei frame
        frame_number = 0

        while True:
            # Leggi ogni frame del video
            ret, frame = video.read()

            # Se non ci sono più frame, interrompi il ciclo
            if not ret:
                break

            # Converti il frame in un'immagine PIL
            image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))

            # Prevedi l'immagine
            prediction = predict_image(image, model, class_names)
            
            # Aggiungi la previsione ai risultati del video
            video_results[f"frame {frame_number}"] = prediction

            # Incrementa il conteggio dei frame
            frame_number += 1

        # Rilascia l'oggetto video
        video.release()

    return video_results
