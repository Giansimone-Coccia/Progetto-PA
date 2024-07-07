import os
import shutil
import torch
import facer

class FaceSegmentation:
    def __init__(self, project_dir):
        # Imposta directory di progetto e dispositivo
        self._project_dir = project_dir
        self._device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        # Inizializza i rilevatori e parser facciali
        self._face_detector = facer.face_detector('retinaface/mobilenet', device=self._device)
        self._face_parser = facer.face_parser('farl/lapa/448', device=self._device)

    def process_images(self):
        all_segments = {}
        #directory = os.path.join(self._project_dir, "results/faces_facer")
        #self._clear_directory(directory)
        # Processa ciascuna immagine nella directory dei risultati
        for filename in os.listdir(os.path.join(self._project_dir, 'images')):
            image_path = os.path.join(self._project_dir, 'images', filename)
            print(filename)
            try:
                image = self._load_image(image_path)
                faces = self._detect_faces(image)
                faces = self._parse_faces(image, faces)
                seg_probs = faces['seg']['logits'].softmax(dim=1)
                all_segments[filename] = self._segment_faces(image, seg_probs, faces)
            except Exception as e:
                print(f"Errore durante l'elaborazione di {filename}: {e}")
                continue  # Passa alla prossima immagine

        return all_segments

    def _clear_directory(self, output_dir):
        # Verifica se la directory esiste
        if os.path.exists(output_dir):
            # Itera sui file nella directory e rimuovili
            for filename in os.listdir(output_dir):
                file_path = os.path.join(output_dir, filename)
                try:
                    if os.path.isfile(file_path) or os.path.islink(file_path):
                        os.unlink(file_path)
                    elif os.path.isdir(file_path):
                        shutil.rmtree(file_path)
                except Exception as e:
                    print(f"Errore durante la rimozione di {file_path}: {e}")
            print(f"Contenuto di {output_dir} svuotato.")
        else:
            print(f"La directory {output_dir} non esiste.")

    def _load_image(self, image_path):
        # Carica e converte l'immagine nel formato richiesto
        image = facer.hwc2bchw(facer.read_hwc(image_path)).to(self._device)
        return image

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
