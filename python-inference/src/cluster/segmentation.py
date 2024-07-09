import logging
import os
import shutil
import tempfile
from PIL import Image
import PIL
import torch
import facer


logging.basicConfig(level=logging.INFO)

class FaceSegmentation:
    def __init__(self, images):
        # Imposta directory di progetto e dispositivo
        self._images = images
        self._device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        # Inizializza i rilevatori e parser facciali
        self._face_detector = facer.face_detector('retinaface/mobilenet', device=self._device)
        self._face_parser = facer.face_parser('farl/lapa/448', device=self._device)

    def process_images(self):
        all_segments = {}
        #directory = os.path.join(self._project_dir, "results/faces_facer")
        #self._clear_directory(directory)
        # Processa ciascuna immagine nella directory dei risultati
        for image in self._images:
            try:
                image_tensor = self._load_image(image[1])
                faces = self._detect_faces(image_tensor)
                faces = self._parse_faces(image_tensor, faces)
                seg_probs = faces['seg']['logits'].softmax(dim=1)
                all_segments[image[0]] = [image[1], self._segment_faces(image_tensor, seg_probs, faces)]
            except Exception as e:
                print(f"Errore durante l'elaborazione di {image[0]}: {e}")
                continue

        return all_segments
    
    def _load_image(self, image):
        if not isinstance(image, PIL.Image.Image):
            raise TypeError("L'input deve essere un oggetto immagine di Pillow (Image)")

        image = image.convert('RGB')  

        with tempfile.NamedTemporaryFile(suffix=".jpg", delete=False) as temp_file:
            temp_path = temp_file.name
            image.save(temp_path)
            logging.info(temp_path)

        try:
            tensor_image = facer.read_hwc(temp_path)
            tensor_processed = facer.hwc2bchw(tensor_image).to(self._device)
        finally:
            temp_file.close()

        os.remove(temp_path)

        return tensor_processed


    def _detect_faces(self, image):
        # Rileva volti nell'immagine
        with torch.inference_mode():
            faces = self._face_detector(image)
        return faces

    def _parse_faces(self, image, faces):
        # Analizza i volti rilevati
        with torch.inference_mode():
            faces = self._face_parser(image, faces)
        return faces

    def _segment_faces(self, image, seg_probs, faces):
        # Segmenta i volti e i relativi componenti
        n_classes = seg_probs.size(1)
        segments = {}
        # Elenco delle classi da escludere
        exclude_classes = ['background', 'mouth']

        for face_id in range(seg_probs.size(0)):
            for class_id in range(n_classes):
                # Ottieni il nome della classe corrente
                class_name = faces['seg']['label_names'][class_id]
                # Salta la classe se è nell'elenco delle classi da escludere
                if class_name in exclude_classes:
                    continue

                mask = (seg_probs[face_id, class_id] > 0.5).float()
                if mask.sum() > 0:
                    if face_id not in segments:
                        segments[face_id] = []
                    segments[face_id].append([mask, class_name])

        return segments
