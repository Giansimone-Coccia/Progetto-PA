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
I diagrammi delle sequenze sono strumenti di modellazione utilizzati nell'ambito dell'ingegneria del software per rappresentare l'interazione tra oggetti in un sistema in un determinato scenario di utilizzo. Questi diagrammi sono particolarmente utili per comprendere come gli oggetti collaborano in una sequenza specifica di azioni, evidenziando l'ordine temporale delle operazioni e le comunicazioni tra gli oggetti coinvolti.

#### Caricamento immagine
Per motivi di semplicità riportiamo solo il caso del caricamento delle immagini (per il caricamento di zip o video il funzionamento è pressoché analogo).

<p align="center">
  <img src="./docs/Caricamento_Immagine.jpg" alt="Caricamento Immagine">
</p>

#### Credito residuo

<p align="center">
  <img src="./docs/Credito_residuo.jpg" alt="Credito Residuo">
</p>

#### CRUD Dataset

<p align="center">
  <img src="./docs/CRUDDataset.jpg" alt="CRUD Dataset">
</p>

#### Ignorare formati non corretti

<p align="center">
  <img src="./docs/Ignorare_formati_non_corretti.jpg" alt="Ignorare Formati Non Corretti">
</p>

#### Restituzione ID processamento

<p align="center">
  <img src="./docs/Restituzione_ID_processamento.jpg" alt="Restituzione ID Processamento">
</p>

#### Ricarica crediti

<p align="center">
  <img src="./docs/Ricarica_crediti.jpg" alt="ricarica Crediti">
</p>

#### Richiesta inferenza

<p align="center">
  <img src="./docs/Richiesta_inferenza.jpg" alt="Richiesta Inferenza">
</p>

#### Risultato inferenza

<p align="center">
  <img src="./docs/Risultato_inferenza.jpg" alt="risultato Inferenza">
</p>

#### Stato di avanzamento

<p align="center">
  <img src="./docs/Stato_avanzamento.jpg" alt="Stato Avanzamento">
</p>

#### Validazione crediti

<p align="center">
  <img src="./docs/Validazione_crediti.jpg" alt="Validazione Crediti">
</p>

### Design Pattern Utilizzati

1. **Pattern repository**: Il pattern Repository è utilizzato per separare la logica di business dalla logica di accesso ai dati nel sistema. Fornisce un'astrazione della persistenza dei dati, permettendo agli altri moduli dell'applicazione di accedere ai dati attraverso interfacce ben definite, senza doversi preoccupare dei dettagli di come i dati sono memorizzati o recuperati. Definisce i metodi di alto livello per l'accesso ai dati, come ad esempio **findById**, **findAll**, **delete**, ecc con relativa implementazione.
2. **Singleton Pattern**: Il pattern Singleton assicura che una classe abbia una sola istanza e fornisce un punto globale di accesso a quella istanza.
3. **Pattern DAO (Data Access Object)**: Il pattern DAO è simile al pattern Repository e si concentra sull'astrazione dell'accesso ai dati, fornendo metodi CRUD (Create, Read, Update, Delete) per interagire con la persistenza dei dati lavorando a più basso livello ed a contatto con il database. Definisce i metodi per l'accesso ai dati, come **create**, **read**, **update**, **delete**, specifici per un'entità o una tabella del database.
4. **Middleware Pattern**: Il termine Middleware si riferisce a un'infrastruttura software che fornisce funzionalità comuni tra diverse applicazioni, componenti di sistema o servizi. Agisce come uno strato intermedio tra l'applicazione e altre componenti o risorse esterne.
5. **Pattern MVC**: Il pattern MVC è un'architettura del software che divide l'applicazione in tre componenti principali: Modello (Model), Vista (View) e Controllore (Controller), ciascuno con responsabilità specifiche.
   - *Modello (Model):* Rappresenta i dati e la logica di business dell'applicazione. Gestisce l'accesso ai dati e fornisce metodi per aggiornare lo stato dell'applicazione.
   - *Vista (View):* Rappresenta l'interfaccia utente dell'applicazione. Si occupa della presentazione dei dati al cliente e delle interazioni dell'utente con l'applicazione.
   - *Controllore (Controller):* Gestisce le interazioni degli utenti e le richieste dell'utente, traducendo le azioni dell'utente sui dati in operazioni da eseguire sul Modello. Aggiorna la Vista quando lo stato del Modello cambia.
6. **Factory Method:** Il factory method è un design pattern creazionale che mira a fornire un'interfaccia per la creazione di oggetti in modo controllato, lasciando la logica di creazione agli oggetti concreti che implementano l'interfaccia. Questo pattern è utile quando si desidera delegare la responsabilità di creazione di oggetti ad una classe specifica anziché farlo direttamente all'interno del codice client.

## Avvio del Progetto
Di seguito riportiamo i requisiti e le istruzioni necessarie per avviare correttamente il sistema.

### Requisiti
- Docker
- Docker Compose
- Node.js
- Express

### Istruzioni per l'Avvio
1. Clonare il repository nella propria directory o scaricare direttamente il file .zip:
   ```bash
   git clone https://github.com/Giansimone-Coccia/Progetto-PA.git
2. Esegire le migrations (opzionale):
   ```bash
   npx sequelize-cli db:migrate
4. Eseguire i seeders (opzionale):
   ```bash
   npx sequelize-cli db:seed:all
5. Eseguire la build del progetto:
   ```bash
   docker-compose build
6. Eseguire il run del progetto:
   ```bash
   docker-compose up OPPURE docker-compose up --build
7. Eseguire le chiamate su Postman

## Rotte Disponibili
E' possibile utilizzare strumenti come Postman per eseguire facilmente le chiamate alle rotte API seguenti.

### Registrazione Utente/Admin
**POST** http://localhost:3000/auth/register

### Descrizione
Registra un nuovo utente o un amministratore nel sistema.

#### Parametri della Richiesta nel Body
- `email`: Deve rispettare il formato email.
- `password`: Deve essere lunga almeno 8 caratteri e includere almeno una cifra, una lettera minuscola, una lettera maiuscola e un carattere speciale.
- `role`: Può essere `user` o `admin`.

#### Parametri della Risposta
- `tokens`: I gettoni disponibili per l'utente, di default impostati a 1000.
- `id`: L'identificativo dell'utente generato dal database.
- `email`: L'email dell'utente.
- `role`: Ruolo dell'utente.
- `updatedAt`: Data dell'ultimo aggiornamento dell'utente.
- `createdAt`: Data di creazione dell'utente.

#### Esempio
##### Body della Richiesta
```json
{
  "email": "esempio@email.com",
  "password": "Password123!",
  "role": "user"
}
```
##### Risposta
```json
{
  "tokens": 1000,
  "id": "1234567890",
  "email": "esempio@email.com",
  "password": "$2a$10$YPAjwI79f4ft4zm8L9Av4eBKXKT682R1Ff.vQx2ObnYNewzhakPWK",
  "role": "user",
  "updatedAt": "2024-07-10T12:00:00Z",
  "createdAt": "2024-07-10T11:59:00Z"
}
```

### Login Utente/Admin
**POST** http://localhost:3000/auth/login

### Descrizione
Genera il tokendi accesso JWT dell'utente o dell'amministratore di sistema.

#### Parametri della Richiesta nel Body
- `email`: Email dell'utente/admin.
- `password`: Password dell'utente/admin.

#### Parametri della Risposta
- `token`: token JWT

#### Esempio
##### Body della Richiesta
```json
{
  "email": "esempio@email.com",
  "password": "Password123!"
}
```
##### Risposta
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ1c2VyMUBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzIwNjAwMzEyLCJleHAiOjE3MjA2MDM5MTJ9.TVDOUzpwdoYi08yKUZ_Q4Xf5PHwBme21PPUBMUuZ6tM"
}
```

### Get user token
**GET** http://localhost:3000/api/users/token

### Descrizione
Restituisce i token dell'utente.

#### Authorization
Per eseguire questa rotta è necessario aver effettuato l'accesso tramite JWT.
- `Auth Type`: Bearer Token.
- `Token`: token JWT.

#### Parametri della Risposta
- `tokens`: token JWT

#### Esempio

##### Risposta
```json
{
    "tokens": 9018.85
}
```

### Credt recharge
**POST** http://localhost:3000/api/users/recharge

### Descrizione
Consente all'admin di ricaricare i roken per uno specifico utente.

#### Authorization
Per eseguire questa rotta è necessario che l'admin abbia effettuato l'accesso tramite JWT.
- `Auth Type`: Bearer Token.
- `Token`: token JWT.

#### Parametri della Richiesta nel Body
- `emailUser`: Email dell'utente scelto.
- `tokenUser`: Password da aggiungere.

#### Parametri della Risposta
- `message`: messaggio di avvenuta modifica

#### Esempio
##### Body della Richiesta
```json
{
    "emailUser": "user1@example.com",
    "tokenUser": "150"
}
```
##### Risposta
```json
{
    "message": "Tokens updated successfully. New token value: 9168.85"
}
```

### Inferenza
**POST** http://localhost:3000/api/inferences

### Descrizione
Consente all'utente di eseguire un'inferenza su un dataset specificato.

#### Authorization
Per eseguire questa rotta è necessario che l'utente abbia effettuato l'accesso tramite JWT.
`Auth Type`: Bearer Token.
`Token`: token JWT.

#### Parametri della Richiesta nel Body
- `datasetId`: Id del dataset su cui effettuare l'inferenza.
- `modelId`: Id del modello da utilizzare, che può essere scelto tra tre tipologie:
  1. Scegliere `1` se si vuole scegliere di effettuare l'inferenza con il modello a 12 classi
  2. Scegliere `2` se si vuole scegliere di effettuare l'inferenza con il modello a 4 classi
  3. Scegliere `3` se si vuole eseguire il clustering

#### Parametri della Risposta
- `inference_job_id`: Id del job.

#### Esempio
##### Body della Richiesta
```json
{
  "datasetId": "1",
  "modelId": "2"
}
```
##### Risposta
```json
{
    "inference_job_id": "14"
}
```

### Get status
**GET** http://localhost:3000/api/inferences/status/:jobId

### Descrizione
Consente all'utente di ottenere, mediante l'id dell'inferenza, lo stato del processo.

#### Authorization
Per eseguire questa rotta è necessario che l'utente abbia effettuato l'accesso tramite JWT.
- `Auth Type`: Bearer Token.
- `Token`: token JWT.

#### Parametri della Richiesta
- `jobId`: Id del job restituito dalla chiamata precedente.

#### Parametri della Risposta
- `jobId`: Id del job.
- `state`: Stato del processamento.
- `message`: Messaggio.
- `result`: Risultato ottenuto dal processamento.
- `model`: Id del modello utilizzato.
- `updatedAt`: Data e ora dell'ultimo aggiornamento avvenuto.
- `createdAt`: Data e ora della creazione.

##### Rotta
**GET** http://localhost:3000/api/inferences/status/13

##### Risposta
```json
{
    "jobId": "13",
    "state": "completed",
    "message": "Job completed",
    "result": {
        "id": 20,
        "datasetId": "1",
        "cost": 176,
        "result": {
            "1 second faces.mp4": {
                "frame_0": [
                    {
                        "class_name": "autunno",
                        "probability": 0.274
                    },
                    {
                        "class_name": "estate",
                        "probability": 0.173
                    },
                    {
                        "class_name": "inverno",
                        "probability": 0.462
                    },
                    {
                        "class_name": "primavera",
                        "probability": 0.091
                    }
                ]
            },
            "image 1.jpg": [
                {
                    "class_name": "autunno",
                    "probability": 0.397
                },
                {
                    "class_name": "estate",
                    "probability": 0.136
                },
                {
                    "class_name": "inverno",
                    "probability": 0.215
                },
                {
                    "class_name": "primavera",
                    "probability": 0.251
                }
            ]
        },
        "model": "2",
        "updatedAt": "2024-07-10T10:53:18.772Z",
        "createdAt": "2024-07-10T10:53:18.772Z"
    }
}
```

### Get Inferenza tramite Id
**GET** http://localhost:3000/auth/inferences/:id

### Descrizione
Restituisce il risultato dell'inferenza dato l'Id.

#### Authorization
Per eseguire questa rotta è necessario aver effettuato l'accesso tramite JWT.
- `Auth Type`: Bearer Token.
- `Token`: Token JWT.

#### Parametri della Richiesta
- `id`: Id dell'inferenza.

#### Parametri della Risposta
- `id`: Id dell'inferenza.
- `datasetId`: Id del database di cui si è fatta l'infernza.
- `model`: Modello di cui si è effettuata l'inferenza.
- `result`: Risultato dell'inferenza, questo varia tra i modelli.

#### Esempio
##### Rotta
**GET** http://localhost:3000/auth/inferences/123

##### Risposta per il modello 2
```json
{
   "id":123,
   "datasetId":123,
   "model":"2",
   "result":{
      "image":[
         {
            "class_name":"autunno",
            "probability":0.396
         },
         {
            "class_name":"estate",
            "probability":0.136
         },
         {
            "class_name":"inverno",
            "probability":0.216
         },
         {
            "class_name":"primavera",
            "probability":0.252
         }
      ],
      "Zip":{
         "image":[
            {
               "class_name":"autunno",
               "probability":0.166
            },
            {
               "class_name":"estate",
               "probability":0.547
            },
            {
               "class_name":"inverno",
               "probability":0.103
            },
            {
               "class_name":"primavera",
               "probability":0.185
            }
         ]
      },
      "Video":{
         "frame_0":[
            {
               "class_name":"autunno",
               "probability":0.166
            },
            {
               "class_name":"estate",
               "probability":0.547
            },
            {
               "class_name":"inverno",
               "probability":0.103
            },
            {
               "class_name":"primavera",
               "probability":0.185
            }
         ]
      }
   }
}
```

### Creazione dataset
**POST** http://localhost:3000/api/datasets

### Descrizione
Consente all'utente di creare un nuovo dataset inizialmente vuoto.

#### Authorization
Per eseguire questa rotta è necessario che l'utente abbia effettuato l'accesso tramite JWT.
- `Auth Type`: Bearer Token.
- `Token`: token JWT.

#### Parametri della Richiesta nel Body
- `name`: Nome del dataset.
- `tags`: Serie di tags correlati al dataset.

#### Parametri della Risposta
- `isDeleted`: Può restituire *true* o *false* in relazione al fatto se il dataset sia stato eliminato o meno
- `id`: Id assegnato al dataset
- `name`: Nome del dataset
- `tags`: Tags del dataset
- `userId`: Id dell'utente
- `updatedAt`: Quando è stato aggiornato
- `createdAt`: Quando è stato creato

#### Esempio
##### Body della Richiesta
```json
{
  "name": "Dataset Example 12",
  "tags": ["data science", "AI", "deep learning"]
}
```
##### Risposta
```json
{
    "isDeleted": false,
    "id": 3,
    "name": "Dataset Example 12",
    "tags": [
        "data science",
        "AI",
        "deep learning"
    ],
    "userId": 1,
    "updatedAt": "2024-07-10T13:45:24.763Z",
    "createdAt": "2024-07-10T13:45:24.763Z"
}
```

### Get all datasets
**GET** http://localhost:3000/api/datasets

### Descrizione
Consente all'utente di ottenere tutti i suoi datasets.

#### Authorization
Per eseguire questa rotta è necessario che l'utente abbia effettuato l'accesso tramite JWT.
- `Auth Type`: Bearer Token.
- `Token`: token JWT.

#### Parametri della Risposta
Può essere un JSONArray contenente informazioni su tutti datasets.
- `id`: Id assegnato al dataset
- `userId`: Id dell'utente
- `name`: Nome del dataset
- `tags`: Tags del dataset
- `isDeleted`: Può restituire *true* o *false* in relazione al fatto se il dataset sia stato eliminato o meno
- `createdAt`: Quando è stato creato
- `updatedAt`: Quando è stato aggiornato

#### Esempio
##### Rotta
**GET** http://localhost:3000/api/datasets

##### Risposta
```json
[
    {
        "id": 1,
        "userId": 1,
        "name": "Dataset figo",
        "tags": [
            "ML"
        ],
        "isDeleted": false,
        "createdAt": "2024-07-08T13:37:24.000Z",
        "updatedAt": "2024-07-10T08:04:18.000Z"
    },
    {
        "id": 2,
        "userId": 1,
        "name": "Dataset nuovo",
        "tags": [
            "ML",
            "Prova"
        ],
        "isDeleted": false,
        "createdAt": "2024-07-08T13:37:24.000Z",
        "updatedAt": "2024-07-09T16:03:28.000Z"
    }
]
```

### Update dataset
**PUT** http://localhost:3000/api/datasets/:id

### Descrizione
Consente all'utente di aggiornare uno dei suoi datasets, con verifica di non sovrapposizione sui contenuti di dataset uguali.

#### Authorization
Per eseguire questa rotta è necessario che l'utente abbia effettuato l'accesso tramite JWT.
- `Auth Type`: Bearer Token.
- `Token`: token JWT.

#### Parametri della Richiesta nel Body
- `name`: Nome del nuovo dataset.
- `tags`: Serie di nuovi tags correlati al dataset.

#### Parametri della Risposta
- `message`: Messaggio di andata a buon fine o meno

#### Esempio
##### Rotta
**PUT** http://localhost:3000/api/datasets/1
##### Body della Richiesta
```json
{
  "name": "Dataset nuovo",
  "tags": ["ML", "Prova"]
}
```
##### Risposta
```json
{
    "message": "Dataset updated"
}
```

### Eliminazione logica dataset
**DELETE** http://localhost:3000/api/datasets/:id

### Descrizione
Consente all'utente di eliminare logicamente uno dei suoi datasets.

#### Authorization
Per eseguire questa rotta è necessario che l'utente abbia effettuato l'accesso tramite JWT.
- `Auth Type`: Bearer Token.
- `Token`: token JWT.

#### Parametri della Richiesta
- `id`: Id del dataset da eliminare.

#### Parametri della Risposta
- `message`: Messaggio di andata a buon fine o meno

#### Esempio
##### Rotta
**DELETE** http://localhost:3000/api/datasets/2

##### Risposta
```json
{
    "message": "Dataset eliminated correctly"
}
```

### Create content
**POST** http://localhost:3000/api/contents

### Descrizione
Consente all'utente di creare un nuovo contenuto all'interno del dataset specificato.

#### Authorization
Per eseguire questa rotta è necessario che l'utente abbia effettuato l'accesso tramite JWT.
- `Auth Type`: Bearer Token.
- `Token`: token JWT.

#### Parametri della Richiesta nel Body
Per questa rotta è necessario impostare *form-data* per il caricamento dei dati.
- `data`: Di tipo *File* consente di caricare un file a scelta tra *zip, jpg, png, mp4, webp*.
- `datasetId`: Id del dataset in cui inserire il contenuto.
- `type`: Tipologia di file a scleta tra *zip, video, image*.
- `name`: Nome del nuovo contenuto.

#### Parametri della Risposta
- `message`: Messaggio di andata a buon fine o meno

#### Esempio
##### Body della Richiesta
<p align="center">
  <img src="./docs/create_content.png" alt="Rotta Create content">
</p>

##### Risposta
```json
{
    "message": "Content created successfully"
}
```
