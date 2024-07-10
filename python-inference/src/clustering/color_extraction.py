import PIL
import numpy as np
import torch
from sklearn.cluster import KMeans

class ColorExtractor:
    """
    A class used to extract dominant colors from segmented facial components in images.
    """

    def __init__(self, images):
        """
        Initializes the ColorExtractor with a list of images.

        Args:
            images (list): A list of images to be processed.
        """
        self._images = images
        self._device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

    def extract_dominant_colors(self, all_segments, normalize=True):
        """
        Extracts dominant colors from all segments of the images.

        Args:
            all_segments (dict): A dictionary containing image segments.
            normalize (bool): Flag to normalize colors. Default is True.

        Returns:
            dict: A dictionary with dominant colors for each segment.
        """
        dominant_colors = {}

        for filename, segments in all_segments.items():
            image_tensor = self._load_image(segments[0])
            for face_id, segment_list in segments[1].items():
                for mask, label_name in segment_list:
                    colors = self._get_segmented_colors(image_tensor, mask)
                    dominant_colors = self._update_dominant_colors(dominant_colors, filename, face_id, label_name, colors)

        if normalize:
            self._normalize_colors(dominant_colors)

        return dominant_colors

    def _load_image(self, image):
        """
        Loads and processes an image.

        Args:
            image (PIL.Image.Image): The image to be loaded.

        Returns:
            torch.Tensor: The processed image tensor.
        """
        if not isinstance(image, PIL.Image.Image):
            raise TypeError("Input must be a PIL Image object")

        if image.mode != 'RGB':
            image = image.convert('RGB')

        np_image = np.array(image)
        image = torch.from_numpy(np_image)

        if not isinstance(image, np.ndarray):
            image = image.numpy()

        image = torch.from_numpy(image).permute(2, 0, 1).unsqueeze(0).to(self._device)

        return image

    def _get_segmented_colors(self, image_tensor, mask):
        """
        Extracts colors from the segmented regions.

        Args:
            image_tensor (torch.Tensor): The image tensor.
            mask (torch.Tensor): The segmentation mask.

        Returns:
            np.ndarray: An array of segmented colors.
        """
        mask = mask.to(self._device)
        pixel_coords = torch.nonzero(mask, as_tuple=True)
        segmented_colors = image_tensor[0, :, pixel_coords[0], pixel_coords[1]].permute(1, 0).cpu().numpy()
        return segmented_colors if segmented_colors.size > 0 else np.array([])

    def _update_dominant_colors(self, dominant_colors, filename, face_id, label_name, segmented_colors):
        """
        Updates the dictionary of dominant colors.

        Args:
            dominant_colors (dict): The current dictionary of dominant colors.
            filename (str): The filename of the image.
            face_id (int): The ID of the face.
            label_name (str): The label name of the segment.
            segmented_colors (np.ndarray): An array of segmented colors.

        Returns:
            dict: The updated dictionary of dominant colors.
        """
        exclude_classes = ['background', 'imouth']
        if label_name in exclude_classes:
            return dominant_colors

        if segmented_colors.size > 0:
            kmeans = KMeans(n_clusters=3).fit(segmented_colors)
            centroids = kmeans.cluster_centers_

            closest_colors = []
            for centroid in centroids:
                distances = np.linalg.norm(segmented_colors - centroid, axis=1)
                closest_color = segmented_colors[np.argmin(distances)]
                closest_colors.append(closest_color)

            if filename not in dominant_colors:
                dominant_colors[filename] = {}
            dominant_colors[filename][label_name] = np.array(closest_colors)

        return dominant_colors

    def _normalize_colors(self, dominant_colors):
        """
        Normalizes RGB values to the range [0, 1].

        Args:
            dominant_colors (dict): The dictionary of dominant colors.
        """
        for filename, faces in dominant_colors.items():
            for label_name, colors in faces.items():
                dominant_colors[filename][label_name] = colors / 255.0
