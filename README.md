# Inference Management System

## Obiettivo del Progetto

Il progetto consiste nella realizzazione di un sistema backend per la gestione dell'inferenza su immagini e file zip contenenti immagini, utilizzando modelli di deep learning pre-addestrati. Il sistema permette agli utenti di creare dataset, caricare contenuti, eseguire inferenze e gestire crediti attraverso un sistema di autenticazione JWT.

## Progettazione

### Analisi dei requisiti
![Analisi dei requisiti](docs/Analisi dei requisiti.jpg)

### Diagrammi UML

#### Diagramma dei Casi d'Uso
![Diagramma dei Casi d'Uso](./docs/use_case_diagram.png)

#### Diagramma delle Sequenze
![Diagramma delle Sequenze](./docs/sequence_diagram.png)

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

