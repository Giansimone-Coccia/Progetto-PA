"""
This module provides the ColorClusterer class which processes colors extracted from images
and performs clustering on the dominant colors.
"""

import pandas as pd
import numpy as np
import torch
from sklearn.cluster import KMeans

class ColorClusterer:
    """
    ColorClusterer class to process and cluster colors extracted from images.
    """

    def __init__(self):
        """Initializes the ColorClusterer with the appropriate device (CPU or GPU)."""
        self._device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    def _extract_colors(self, colors):
        """
        Extracts and processes the colors from the provided images.

        Args:
            colors (dict): A dictionary of image names and their corresponding facial colors.

        Returns:
            tuple: A tuple containing an array of processed colors 
            and a list of image names with colors.
        """
        processed_colors = []
        colors_with_images = []
        max_length = max(len(faces) for faces in colors.values())

        for image_name, faces in colors.items():
            image_colors = []
            for _, part_colors in faces.items():
                image_colors.append(part_colors)

            # Replace missing data with the mean RGB values
            mean_color = np.mean(image_colors, axis=0)
            image_colors = [mean_color if np.any(np.isnan(color)) else color \
                for color in image_colors]

            # Truncate or pad image_colors to reach max_length
            image_colors = image_colors[:max_length]
            while len(image_colors) < max_length:
                image_colors.append(mean_color)

            colors_with_images.append([image_name, image_colors])
            processed_colors.append(image_colors)

        return np.array(processed_colors), colors_with_images

    def cluster(self, colors=None):
        """
        Clusters the extracted colors using KMeans clustering.

        Args:
            colors (dict): A dictionary of image names and their corresponding facial colors.

        Returns:
            dict: A dictionary containing cluster information, centroids, and associated images.
        """
        processed_colors, colors_with_images = self._extract_colors(colors)

        flattened_faces = processed_colors.reshape(processed_colors.shape[0], -1)
        df = pd.DataFrame(flattened_faces)

        kmeans = KMeans(n_clusters=12, random_state=42)
        labels = kmeans.fit_predict(df)

        # Initialize an empty dictionary for clusters
        cluster_dict = {}

        # Iterate over clusters and assign the centroid and corresponding images
        for label in range(kmeans.n_clusters):
            centroid = np.round(kmeans.cluster_centers_[label], 3).tolist()
            cluster_dict[f"cluster_{label}"] = {
                "centroid": centroid,
                "images": []
            }

        # Add images to the corresponding clusters
        for i, label in enumerate(labels):
            image_name = colors_with_images[i][0]
            cluster_dict[f"cluster_{label}"]["images"].append(image_name)

        return cluster_dict
