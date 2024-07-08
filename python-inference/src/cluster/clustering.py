import os
from .segmentation import FaceSegmentation
from .color_extraction import ColorExtractor
from .color_clusterer import ColorClusterer

class Clustering:

    def execute(self, images):
        # Directory locale del progetto Waltico
        project_dir = os.getcwd()

        # Inizializza e processa le immagini per la segmentazione facciale
        face_segmentation = FaceSegmentation(project_dir)
        segments = face_segmentation.process_images()

        # Inizializza e estrai i colori dominanti dai segmenti facciali
        color_extractor = ColorExtractor(project_dir)
        dominant_colors = color_extractor.extract_dominant_colors(segments)

        # Inizializza e estrai i colori dominanti dai segmenti facciali
        color_clusterer = ColorClusterer(project_dir)
        print(f"clustering dominant {dominant_colors}")
        result = color_clusterer.cluster(dominant_colors)
        print(f"clustering result {result}")
        return result
