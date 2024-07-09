# Inference Management System Armocromia
<p align="center">
  <img src="./docs/Armocromia.png" alt="Armocromia">
</p>

## Obiettivo del Progetto

Il progetto consiste nella realizzazione di un sistema backend per la gestione delle inferenze su immagini, video e file zip, utilizzando modelli di Deep Learning pre-addestrati per l'armocromia. Il sistema permette agli utenti di creare dataset, caricare contenuti, eseguire inferenze e gestire crediti attraverso un sistema di autenticazione JWT. I modelli messi a disposizioni restituiscono, data un'immagine in input, la propabilità che quest'ultima appartenga ad una data classe come ad esempio primavera, autunno, inverno... per il modello a 4 classi, summer light, autunno deep... per il modello a 12 classi (in cui vengono individuate 3 sottocategorie per ciascuna stagione).

## Progettazione DB
Di seguito riportiamo il diagramma E-R (Entity-relationship) utilizzato per la progettazione del database. Quest'ultimo è basato su MySQL ed è stato impostato su un server esterno. Il diagramma mostra quattro entità: *Users*, *Contents*, *Datasets* e *Inferences*, ciscuno dei quali con i propri attributi.

<p align="center">
  <img src="./docs/diagramma_pa.png" alt="Diagramma E-R">
</p>

## Analisi dei requisiti
Di seguito vengono riportati i requisiti analizzati, correttamente suddivisi in requisiti funzionali (a sinistra) e non funzionali (a destra).
- *Requisiti funzionali:* descrivono le funzionalità specifiche che il sistema deve fornire per soddisfare le esigenze degli utenti.
- *Requisiti non funzionali:* definiscono le qualità di sistema che non sono direttamente legate alle funzionalità specifiche, ma sono cruciali per garantire il corretto funzionamento e le prestazioni del sistema, in poche parole quelli che possono essere definiti come i vincoli che il sistema deve rispettare.

![Analisi dei requisiti](./docs/Analisi_dei_requisiti.jpg)

### Diagramma dei Casi d'Uso
I diagrammi dei casi d'uso sono utilizzati principalmente per modellare e rappresentare le interazioni tra gli attori (utenti o altri sistemi esterni) e il sistema che si sta progettando o analizzando. Servono a fornire una visione chiara e comprensibile delle funzionalità che il sistema deve supportare, concentrandosi sulle azioni che gli utenti possono compiere e sui risultati che il sistema produce in risposta a queste azioni.

#### Attori
Riportiamo di seguito i principali attori che interagiscono con il nostro sistema.

<p align="center">
  <img src="./docs/Attori.jpg" alt="Attori">
</p>

#### Gestione Dataset

<p align="center">
  <img src="./docs/Gestione_Dataset.jpg" alt="Gestione Dataset">
</p>

#### Gestione Processamento

<p align="center">
  <img src="./docs/Gestione_Processamento.jpg" alt="Gestione Processamento">
</p>

#### Gestione Utente

<p align="center">
  <img src="./docs/Gestione_Utente.jpg" alt="Gestione Utente">
</p>


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

