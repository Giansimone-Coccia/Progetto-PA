import logging
import PIL
import numpy as np
import torch
from sklearn.cluster import KMeans

logging.basicConfig(level=logging.INFO)

class ColorExtractor:
    def __init__(self, images):
        # Imposta directory di progetto e dispositivo
        self._images = images
        #self._device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self._device = torch.device('cpu')

    def extract_dominant_colors(self, all_segments, normalize = True):
        dominant_colors = {}

        for filename, segments in all_segments.items():
            logging.info(filename)
            image_tensor = self._load_image(segments[0])
            for face_id, segment_list in segments[1].items():
                for mask, label_name in segment_list:
                    colors = self._get_segmented_colors(image_tensor, mask)
                    dominant_colors = self._update_dominant_colors(dominant_colors, filename, face_id, label_name, colors)

        return dominant_colors

    def _load_image(self, image):
        if not isinstance(image, PIL.Image.Image):
            raise TypeError("L'input deve essere un oggetto immagine di Pillow (Image)")

        if image.mode != 'RGB':
            image = image.convert('RGB')  

        np_image = np.array(image)
        logging.info("funge ARRAY")
        image = torch.from_numpy(np_image)

        if not isinstance(image, np.ndarray):
            image = image.numpy()

        image = torch.from_numpy(image).permute(2, 0, 1).unsqueeze(0).to(self._device)
            
        return image

    def _get_segmented_colors(self, image_tensor, mask):
        # Estrae i colori dai segmenti in modo vettoriale
        mask = mask.to(self._device)  # Assicurarsi che la maschera sia sullo stesso dispositivo dell'immagine
        pixel_coords = torch.nonzero(mask, as_tuple=True)
        segmented_colors = image_tensor[0, :, pixel_coords[0], pixel_coords[1]].permute(1, 0).cpu().numpy()
        return segmented_colors if segmented_colors.size > 0 else np.array([])


    def _update_dominant_colors(self, dominant_colors, filename, face_id, label_name, segmented_colors):
        # Elenco delle classi da escludere
        exclude_classes = ['background', 'imouth']
        # Salta la classe se è nell'elenco delle classi da escludere
        if label_name in exclude_classes:
            return dominant_colors

        if segmented_colors.size > 0:
            # Applica KMeans
            kmeans = KMeans(n_clusters=3).fit(segmented_colors)
            # Ottieni i centroidi
            centroids = kmeans.cluster_centers_

            # Trova il colore più vicino a ciascun centroide
            closest_colors = []
            for centroid in centroids:
                distances = np.linalg.norm(segmented_colors - centroid, axis=1)
                closest_color = segmented_colors[np.argmin(distances)]
                closest_colors.append(closest_color)

            if filename not in dominant_colors:
                dominant_colors[filename] = {}
            dominant_colors[filename][label_name] = np.array(closest_colors)

        return dominant_colors

    def _are_colors_normalized(self, dominant_colors):
      # Controlla che tutti i valori siano normalizzati
      return all(
          (0 <= colors).all() and (colors <= 1).all()
          for faces in dominant_colors.values()
          for colors in faces.values()
      )

    def _normalize_colors(self, dominant_colors):
      # Normalizza i valori RGB nel range [0, 1]
      for filename, faces in dominant_colors.items():
              for label_name, colors in faces.items():
                  dominant_colors[filename][label_name] = colors / 255.0