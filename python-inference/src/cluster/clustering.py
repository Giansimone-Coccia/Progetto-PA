import logging
import os
from .segmentation import FaceSegmentation
from .color_extraction import ColorExtractor
from .color_clusterer import ColorClusterer

# Configura il logging
logging.basicConfig(level=logging.INFO)

class Clustering:

    def execute(self, images):
        # Directory locale del progetto Waltico
        logger = logging.getLogger(__name__)


        # Inizializza e processa le immagini per la segmentazione facciale
        face_segmentation =  FaceSegmentation(images)
        segments = face_segmentation.process_images()

        logging.info("sgmenti sviluppati")

        # Inizializza e estrai i colori dominanti dai segmenti facciali
        color_extractor = ColorExtractor(images)
        dominant_colors = color_extractor.extract_dominant_colors(segments)

        logging.info("colori dominanti estratti")

        # Inizializza e estrai i colori dominanti dai segmenti facciali
        color_clusterer = ColorClusterer()
        logger.info(f'Clustering dominant colors: {len(dominant_colors.keys())}')
        result = color_clusterer.cluster(dominant_colors)
        logger.info(f'Clustering result: {result}')
        
        return result
