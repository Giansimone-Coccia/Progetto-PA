import csv
from venv import logger
import pandas as pd
import numpy as np
import torch
from sklearn.cluster import KMeans

class ColorClusterer:
    def __init__(self):
        self._device = print(torch.device('cuda' if torch.cuda.is_available() else 'cpu'))

    def _extract_colors(self, colors):
        colori = []
        colori_with_jpg = []
        max_length = max(len(volti) for volti in colors.values())

        for image_name, volti in colors.items():
            image_colors = []
            for parte, colori_parte in volti.items():
                image_colors.append(colori_parte)

            # Sostituisci i dati mancanti con la media dei valori presenti per quella dimensione RGB
            mean_color = np.mean(image_colors, axis=0)
            image_colors = [mean_color if np.any(np.isnan(color)) else color for color in image_colors]

            # Tronca o padda image_colors per raggiungere max_length
            image_colors = image_colors[:max_length]
            while len(image_colors) < max_length:
                image_colors.append(mean_color)

            colori_with_jpg.append([image_name,image_colors])
            colori.append(image_colors)

        return np.array(colori), colori_with_jpg

    def cluster(self, colors=None):
        colori, colori_with_jpg = self._extract_colors(colors)

        flattened_faces = colori.reshape(colori.shape[0], -1)
        df = pd.DataFrame(flattened_faces)

        kmeans = KMeans(n_clusters=12, random_state=42)
        labels = kmeans.fit_predict(df)

        # Inizializza un dizionario vuoto per i cluster
        cluster_dict = {}

        # Itera sui cluster e assegna le immagini corrispondenti
        for label in range(kmeans.n_clusters):
            cluster_dict[label] = []

        # Aggiungi le immagini ai cluster corrispondenti
        for i, label in enumerate(labels):
            image_name = colori_with_jpg[i][0]
            cluster_dict[label].append(image_name)

        return cluster_dict

    