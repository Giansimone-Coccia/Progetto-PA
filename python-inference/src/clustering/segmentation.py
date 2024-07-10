"""
This module provides the FaceSegmentation class which processes images for facial detection
and segmentation.
"""

import logging
import PIL
import numpy as np
import torch
import facer

logging.basicConfig(level=logging.INFO)

class FaceSegmentation:
    """
    FaceSegmentation class to detect and segment faces in provided images.
    """

    def __init__(self, images):
        """
        Initializes the FaceSegmentation with images and sets up the device and facial detectors.

        Args:
            images (list): A list of images to process.
        """
        self._images = images
        self._device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self._face_detector = facer.face_detector('retinaface/mobilenet', device=self._device)
        self._face_parser = facer.face_parser('farl/lapa/448', device=self._device)

    def process_images(self):
        """
        Processes the images for facial detection and segmentation.

        Returns:
            dict: A dictionary containing the segmented faces and their components.
        """
        all_faces = {}
        all_segments = {}
        index = 0

        # Phase 1: Detection
        while index < len(self._images):
            image = self._images[index]

            try:
                image_tensor = self._load_image(image[1])
                faces = self._detect_faces(image_tensor)

                if len(faces['rects']) > 1:
                    self._extract_multiple_faces(image, faces)
                    continue

                all_faces[image[0]] = (image[1], faces)

            except Exception as e:
                logging.info("Error during detection in %s: %s", image[0], e)

            index += 1

        if len(all_faces) < 12:
            return False

        # Phase 2: Segmentation
        for key, (image_path, faces) in all_faces.items():
            try:
                image_tensor = self._load_image(image_path)
                faces = self._parse_faces(image_tensor, faces)
                seg_probs = faces['seg']['logits'].softmax(dim=1)
                all_segments[key] = [image_path, self._segment_faces(seg_probs, faces)]

            except Exception as e:
                logging.info("Error during segmentation of %s: %s", key, e)

        return all_segments

    def _extract_multiple_faces(self, image, faces):
        """
        Extracts multiple faces from an image and adds them to the images list.

        Args:
            image (tuple): A tuple containing image name and image object.
            faces (dict): A dictionary containing face detection results.
        """
        if not isinstance(image[1], PIL.Image.Image):
            raise TypeError("Input must be a Pillow Image object")

        np_image = np.array(image[1])
        faces_array = []
        for i, rect in enumerate(faces['rects']):
            x1, y1, x2, y2 = map(int, rect)
            face_image = np_image[y1:y2, x1:x2]
            face_pil = PIL.Image.fromarray(face_image)
            faces_array.append([f'{image[0]}/face_{i}', face_pil])
        try:
            index = self._images.index(image)
            self._images = self._images[:index] + faces_array + self._images[index + 1:]
        except ValueError:
            logging.info("Image %s not found in the list.", image[0])

    def _load_image(self, image):
        """
        Loads and processes an image for facial detection and segmentation.

        Args:
            image (PIL.Image.Image): The image to process.

        Returns:
            torch.Tensor: The processed image tensor.
        """
        if not isinstance(image, PIL.Image.Image):
            raise TypeError("Input must be a Pillow Image object")

        if image.mode != 'RGB':
            image = image.convert('RGB')

        np_image = np.array(image)
        tensor_image = torch.from_numpy(np_image)
        tensor_processed = facer.hwc2bchw(tensor_image).to(self._device)

        return tensor_processed

    def _detect_faces(self, image):
        """
        Detects faces in the provided image.

        Args:
            image (torch.Tensor): The image tensor to process.

        Returns:
            dict: A dictionary containing face detection results.
        """
        with torch.inference_mode():
            faces = self._face_detector(image)
        return faces

    def _parse_faces(self, image, faces):
        """
        Parses the detected faces in the provided image.

        Args:
            image (torch.Tensor): The image tensor to process.
            faces (dict): The detected faces to parse.

        Returns:
            dict: A dictionary containing parsed face results.
        """
        with torch.inference_mode():
            faces = self._face_parser(image, faces)
        return faces

    def _segment_faces(self, seg_probs, faces):
        """
        Segments the faces and their components in the provided image.

        Args:
            seg_probs (torch.Tensor): The segmentation probabilities.
            faces (dict): The parsed face results.

        Returns:
            dict: A dictionary containing segmented face components.
        """
        n_classes = seg_probs.size(1)
        segments = {}
        exclude_classes = ['background', 'mouth']

        for face_id in range(seg_probs.size(0)):
            for class_id in range(n_classes):
                class_name = faces['seg']['label_names'][class_id]
                if class_name in exclude_classes:
                    continue

                mask = (seg_probs[face_id, class_id] > 0.5).float()
                if mask.sum() > 0:
                    if face_id not in segments:
                        segments[face_id] = []
                    segments[face_id].append([mask, class_name])

        return segments
