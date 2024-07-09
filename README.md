# Inference Management System

## Obiettivo del Progetto

Il progetto consiste nella realizzazione di un sistema backend per la gestione dell'inferenza su immagini e file zip contenenti immagini, utilizzando modelli di deep learning pre-addestrati. Il sistema permette agli utenti di creare dataset, caricare contenuti, eseguire inferenze e gestire crediti attraverso un sistema di autenticazione JWT.

## Progettazione DB
![Diagramma E-R](./docs/diagramma_pa.png)

## Analisi dei requisiti
![Analisi dei requisiti](./docs/Analisi_dei_requisiti.jpg)

### Diagramma dei Casi d'Uso
#### Attori
![Attori](./docs/Attori.jpg)
#### Gestione Dataset
![Analisi dei requisiti](./docs/Gestione_Dataset.jpg)
#### Gestione Processamento
![Analisi dei requisiti](./docs/Gestione_Processamento.jpg)
#### Gestione Utente
![Analisi dei requisiti](./docs/Gestione_Utente.jpg)


### Diagramma delle Sequenze
#### Caricamento immagine
Il funzionameneto è simile per il caricamento dello zip o dei video.
![Diagramma delle Sequenze](./docs/Caricamento_Immagine.jpg)
#### Credito residuo
![Diagramma delle Sequenze](./docs/Credito_residuo.jpg)
#### CRUD Dataset
![Diagramma delle Sequenze](./docs/CRUDDataset.jpg)
#### Ignorare formati non corretti
![Diagramma delle Sequenze](./docs/Ignorare_formati_non_corretti.jpg)
#### Restituzione ID processamento
![Diagramma delle Sequenze](./docs/Restituzione_ID_processamento.jpg)
#### Ricarica crediti
![Diagramma delle Sequenze](./docs/Ricarica_crediti.jpg)
#### Richiesta inferenza
![Diagramma delle Sequenze](./docs/Richiesta_inferenza.jpg)
#### Risultato inferenza
![Diagramma delle Sequenze](./docs/Risultato_inferenza.jpg)
#### Stato di avanzamento
![Diagramma delle Sequenze](./docs/Stato_avanzamento.jpg)
#### Validazione crediti
![Diagramma delle Sequenze](./docs/Validazione_crediti.jpg)

### Design Pattern Utilizzati

1. **Factory Pattern**: Utilizzato per creare istanze dei modelli di inferenza in base all'ID fornito dall'utente.
2. **Singleton Pattern**: Utilizzato per la gestione della connessione al database.
3. **Strategy Pattern**: Utilizzato per differenziare la logica di caricamento di immagini, zip e video.
4. **Middleware Pattern**: Utilizzato per la gestione delle autenticazioni e validazioni delle richieste.

## Avvio del Progetto

### Requisiti
- Docker
- Docker Compose

### Istruzioni per l'Avvio
1. Clonare il repository:
   ```bash
   git clone https://github.com/yourusername/inference-management-system.git
   cd inference-management-system

