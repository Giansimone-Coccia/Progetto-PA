import csv
from venv import logger
import pandas as pd
import numpy as np
import torch
from sklearn.cluster import KMeans

class ColorClusterer:
    def __init__(self, project_dir):
        self._project_dir = project_dir
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

            colori_with_jpg.append({
            "image_name": image_name,
            "colors": image_colors
        })
        colori.append(image_colors)

        return np.array(colori), colori_with_jpg

    def cluster(self, colors=None):
        colori, colori_with_jpg = self._extract_colors(colors)
        print(f"Color_clusterer colori: {colori}")
        print(f"Color clusterer colori_with: {colori_with_jpg}")
        
        # Stampa le dimensioni originali dell'array
        print(f"Dimensioni originali di colori: {colori.shape}")
        print("ciao1")
        logger.info("ciao3")
        
        # Verifica il numero di campioni e la struttura dei dati
        if len(colori) == 0:
            raise ValueError("Nessun dato di colore disponibile per il clustering.")
        
        # Verifica che ci siano almeno 12 campioni, altrimenti k-means non può creare 12 cluster
        if len(colori) < 12:
            raise ValueError(f"Numero di campioni ({len(colori)}) inferiore al numero di cluster richiesti (12).")

        # Esegui il reshape
        try:
            flattened_faces = colori.reshape(colori.shape[0], -1)
        except ValueError as e:
            print(f"Errore durante il reshape: {e}")
            raise
        
        print("ciao2")
        print(f"Color_clusterer: {flattened_faces}")
        print(f"Dimensioni di flattened_faces: {flattened_faces.shape}")

        kmeans = KMeans(n_clusters=1, random_state=42)
        labels = kmeans.fit_predict(flattened_faces)

        result = {
            "clusters": labels.tolist(),
            "colors_with_images": colori_with_jpg
        }

        return result

    