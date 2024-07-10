from .segmentation import FaceSegmentation
from .color_extraction import ColorExtractor
from .color_clusterer import ColorClusterer

class Clustering:

    def execute(self, images):

        # Inizializza e processa le immagini per la segmentazione facciale
        face_segmentation =  FaceSegmentation(images)
        segments = face_segmentation.process_images()

        if not segments:
            return False

        # Inizializza e estrai i colori dominanti dai segmenti facciali
        color_extractor = ColorExtractor(images)
        dominant_colors = color_extractor.extract_dominant_colors(segments)

        # Inizializza e estrai i colori dominanti dai segmenti facciali
        color_clusterer = ColorClusterer()
    
        result = color_clusterer.cluster(dominant_colors)
        
        return result
