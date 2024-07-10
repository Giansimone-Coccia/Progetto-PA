"""
This module provides the Clustering class which processes images for facial segmentation,
extracts dominant colors, and clusters the colors.
"""

from .segmentation import FaceSegmentation
from .color_extraction import ColorExtractor
from .color_clusterer import ColorClusterer

class Clustering:
    """
    Clustering class to process images for facial segmentation, extract dominant colors,
    and cluster the colors.
    """

    def execute(self, images):
        """
        Executes the clustering process on the provided images.

        Args:
            images (list): A list of images to be processed.

        Returns:
            dict or bool: Returns the clustering result as a dictionary if successful, 
                          otherwise returns False if segments are not found.
        """
        # Initialize and process the images for facial segmentation
        face_segmentation = FaceSegmentation(images)
        segments = face_segmentation.process_images()

        if not segments:
            return False

        # Initialize and extract the dominant colors from the facial segments
        color_extractor = ColorExtractor(images)
        dominant_colors = color_extractor.extract_dominant_colors(segments)

        # Initialize and cluster the dominant colors
        color_clusterer = ColorClusterer()
        result = color_clusterer.cluster(dominant_colors)
        
        return result
