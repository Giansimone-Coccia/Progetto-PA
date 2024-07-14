# Inference Management System Armocromia
<p align="center">
  <img src="./docs/Armocromia.png" alt="Armocromia">
</p>

## Link Collection rotte Postman
[Link](https://gianswaltico.postman.co/workspace/gians_waltico-Workspace~4a40b144-79ef-41da-8d0e-207fd3d24b70/collection/36717994-39b5ff57-9e62-4ff3-9699-b5923b857ba3?action=share&creator=36717994)

## Obiettivo del Progetto

Il progetto consiste nella realizzazione di un sistema backend per la gestione delle inferenze su immagini, video e file zip, utilizzando modelli di Deep Learning pre-addestrati per l'armocromia. Il sistema permette agli utenti di creare dataset, caricare contenuti, eseguire inferenze e gestire crediti attraverso un sistema di autenticazione JWT. I modelli messi a disposizioni restituiscono, data un'immagine in input, la propabilità che quest'ultima appartenga ad una data classe come ad esempio primavera, autunno, inverno... per il modello a 4 classi, summer light, autunno deep... per il modello a 12 classi (in cui vengono individuate 3 sottocategorie per ciascuna stagione).

## Progettazione DB
Di seguito riportiamo il diagramma E-R (Entity-relationship) utilizzato per la progettazione del database. Quest'ultimo è basato su MySQL ed è stato impostato su un server esterno. Per accedere al DB è possibile collegarsi al segeunte link ed effettuare l'accesso: https://www.db4free.net/phpMyAdmin/ 

Il diagramma mostra quattro entità: *Users*, *Contents*, *Datasets* e *Inferences*, ciscuno dei quali con i propri attributi.

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
2. Esegire le migrations dentro la directory [database](https://github.com/Giansimone-Coccia/Progetto-PA/tree/main/node-js%20app/src/database) (opzionale, il DB contiene già dati basilari):
   ```bash
   npx sequelize-cli db:migrate
3. Eseguire i seeders dentro la directory [database](https://github.com/Giansimone-Coccia/Progetto-PA/tree/main/node-js%20app/src/database) (opzionale, il DB contiene già dati basilari):
   ```bash
   npx sequelize-cli db:seed:all
4. Eseguire la build del progetto:
   ```bash
   docker-compose build
5. Eseguire il run del progetto:
   ```bash
   docker-compose up OPPURE docker-compose up --build
6. Eseguire le chiamate su Postman

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
Solo nel caso in cui lo stato sia *completed* viene visualizzato anche il risultato.
```json
{
    "jobId": "15",
    "state": "running",
    "message": "Job in progress"
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

##### Risposta per il modello 1
```json
{
   "id":123,
   "datasetId":123,
   "model":"1",
   "result":{
      "image":[
         {
            "class_name":"autunno deep",
            "probability":0.437
         },
         {
            "class_name":"autunno soft",
            "probability":0.063
         },
         {
            "class_name":"autunno warm",
            "probability":0.146
         },
         {
            "class_name":"inverno bright",
            "probability":0.009
         },
         {
            "class_name":"inverno cool",
            "probability":0.071
         },
         {
            "class_name":"inverno deep",
            "probability":0.145
         },
         {
            "class_name":"primavera bright",
            "probability":0.052
         },
         {
            "class_name":"primavera light",
            "probability":0.009
         },
         {
            "class_name":"primavera warm",
            "probability":0.015
         },
         {
            "class_name":"summer cool",
            "probability":0.017
         },
         {
            "class_name":"summer light",
            "probability":0.005
         },
         {
            "class_name":"summer soft",
            "probability":0.03
         }
      ],
      "Zip":{
         "image":[
            {
               "class_name":"autunno deep",
               "probability":0.077
            },
            {
               "class_name":"autunno soft",
               "probability":0.13
            },
            {
               "class_name":"autunno warm",
               "probability":0.079
            },
            {
               "class_name":"inverno bright",
               "probability":0.036
            },
            {
               "class_name":"inverno cool",
               "probability":0.15
            },
            {
               "class_name":"inverno deep",
               "probability":0.045
            },
            {
               "class_name":"primavera bright",
               "probability":0.142
            },
            {
               "class_name":"primavera light",
               "probability":0.033
            },
            {
               "class_name":"primavera warm",
               "probability":0.071
            },
            {
               "class_name":"summer cool",
               "probability":0.141
            },
            {
               "class_name":"summer light",
               "probability":0.022
            },
            {
               "class_name":"summer soft",
               "probability":0.074
            }
         ]
      },
      "Video":{
         "frame_0":[
            {
               "class_name":"autunno deep",
               "probability":0.016
            },
            {
               "class_name":"autunno soft",
               "probability":0.03
            },
            {
               "class_name":"autunno warm",
               "probability":0.014
            },
            {
               "class_name":"inverno bright",
               "probability":0.464
            },
            {
               "class_name":"inverno cool",
               "probability":0.115
            },
            {
               "class_name":"inverno deep",
               "probability":0.06
            },
            {
               "class_name":"primavera bright",
               "probability":0.053
            },
            {
               "class_name":"primavera light",
               "probability":0.009
            },
            {
               "class_name":"primavera warm",
               "probability":0.02
            },
            {
               "class_name":"summer cool",
               "probability":0.061
            },
            {
               "class_name":"summer light",
               "probability":0.151
            },
            {
               "class_name":"summer soft",
               "probability":0.007
            }
         ]
      }
   }
}
```

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
##### Risposta per il modello 3
```json
{
   "id":123,
   "datasetId":123,
   "model":"3",
   "result":{
      "cluster_0": {
              "centroid": [0.746, 0.646, 0.558, 0.576, 0.497, 0.424, 0.613, 0.525, 0.45, 0.444, 0.359, 0.301, 0.486, 0.392, 0.332, 0.438, 0.354, 0.296, 0.282, 0.211, 0.161, 0.309, 0.238, 0.187, 0.345, 0.266, 0.215, 0.724, 0.673, 0.608, 0.356, 0.357, 0.303, 0.642, 0.597, 0.534, 0.319, 0.322, 0.272, 0.63, 0.587, 0.532, 0.515, 0.483, 0.427, 0.755, 0.627, 0.535, 0.713, 0.592, 0.499, 0.865, 0.746, 0.655, 0.582, 0.43, 0.362, 0.731, 0.561, 0.498, 0.508, 0.365, 0.303, 0.838, 0.625, 0.58, 0.728, 0.55, 0.495, 0.854, 0.634, 0.59, 0.114, 0.095, 0.079, 0.218, 0.17, 0.139, 0.145, 0.117, 0.098],
              "images": ["video.mp4/frame_0"]
          },
          "cluster_1": {
              "centroid": [0.644, 0.563, 0.49, 0.714, 0.624, 0.546, 0.342, 0.295, 0.254, 0.422, 0.356, 0.295, 0.455, 0.382, 0.324, 0.395, 0.325, 0.264, 0.269, 0.213, 0.166, 0.328, 0.254, 0.203, 0.298, 0.234, 0.182, 0.613, 0.567, 0.52, 0.486, 0.456, 0.41, 0.38, 0.366, 0.314, 0.434, 0.405, 0.362, 0.344, 0.323, 0.29, 0.354, 0.344, 0.306, 0.601, 0.497, 0.42, 0.808, 0.706, 0.633, 0.705, 0.605, 0.531, 0.698, 0.541, 0.477, 0.712, 0.537, 0.476, 0.62, 0.452, 0.399, 0.756, 0.557, 0.523, 0.753, 0.557, 0.519, 0.655, 0.481, 0.437, 0.115, 0.093, 0.076, 0.163, 0.129, 0.114, 0.112, 0.093, 0.086],
              "images": ["video.mp4/frame_1"]
          },
          "cluster_2": {
              "centroid": [0.761, 0.663, 0.588, 0.441, 0.38, 0.329, 0.445, 0.384, 0.333, 0.339, 0.271, 0.222, 0.502, 0.42, 0.365, 0.424, 0.341, 0.286, 0.304, 0.241, 0.19, 0.218, 0.171, 0.131, 0.373, 0.29, 0.231, 0.653, 0.614, 0.565, 0.294, 0.282, 0.231, 0.496, 0.447, 0.388, 0.449, 0.424, 0.378, 0.388, 0.367, 0.322, 0.302, 0.284, 0.241, 0.602, 0.5, 0.427, 0.675, 0.569, 0.502, 0.753, 0.647, 0.58, 0.402, 0.235, 0.198, 0.543, 0.392, 0.345, 0.676, 0.524, 0.469, 0.79, 0.565, 0.557, 0.618, 0.447, 0.412, 0.635, 0.453, 0.427, 0.124, 0.096, 0.086, 0.082, 0.069, 0.055, 0.153, 0.122, 0.11],
              "images": ["video.mp4/frame_2"]
          },
          "cluster_3": {
              "centroid": [0.937, 0.82, 0.718, 0.867, 0.655, 0.506, 0.506, 0.341, 0.247, 0.729, 0.525, 0.431, 0.82, 0.655, 0.561, 0.914, 0.816, 0.729, 0.749, 0.49, 0.353, 0.631, 0.38, 0.275, 0.718, 0.439, 0.329, 0.251, 0.224, 0.192, 0.729, 0.584, 0.549, 0.945, 0.894, 0.859, 0.902, 0.839, 0.78, 0.267, 0.227, 0.18, 0.596, 0.498, 0.471, 0.945, 0.824, 0.745, 0.886, 0.682, 0.537, 0.624, 0.353, 0.29, 0.91, 0.643, 0.553, 0.714, 0.314, 0.267, 0.851, 0.494, 0.42, 0.906, 0.573, 0.494, 0.941, 0.682, 0.62, 0.784, 0.384, 0.337, 0.149, 0.106, 0.082, 0.376, 0.251, 0.2, 0.592, 0.431, 0.361],
              "images": ["video.mp4/frame_3"]
          },
          "cluster_4": {
              "centroid": [0.898, 0.706, 0.576, 0.827, 0.553, 0.412, 0.537, 0.314, 0.235, 0.537, 0.329, 0.275, 0.376, 0.22, 0.18, 0.706, 0.463, 0.365, 0.451, 0.259, 0.2, 0.733, 0.459, 0.361, 0.6, 0.341, 0.278, 0.569, 0.329, 0.267, 0.255, 0.376, 0.275, 0.22, 0.569, 0.439, 0.365, 0.369, 0.31, 0.275, 0.173, 0.133, 0.098, 0.204, 0.176, 0.161, 0.42, 0.306, 0.263, 0.239, 0.216, 0.188, 0.875, 0.729, 0.647, 0.714, 0.506, 0.431, 0.749, 0.62, 0.553, 0.871, 0.639, 0.573, 0.859, 0.702, 0.639, 0.153, 0.125, 0.114, 0.129, 0.106, 0.086, 0.149, 0.122, 0.106],
              "images": ["video.mp4/frame_4"]
          },
          "cluster_5": {
              "centroid": [0.801, 0.702, 0.638, 0.442, 0.374, 0.318, 0.533, 0.448, 0.38, 0.511, 0.432, 0.372, 0.508, 0.432, 0.365, 0.42, 0.353, 0.298, 0.409, 0.329, 0.282, 0.55, 0.452, 0.381, 0.506, 0.42, 0.359, 0.567, 0.48, 0.416, 0.471, 0.404, 0.345, 0.486, 0.416, 0.359, 0.682, 0.569, 0.502, 0.42, 0.812, 0.69, 0.616, 0.75, 0.63, 0.561, 0.836, 0.71, 0.639, 0.814, 0.686, 0.612, 0.799, 0.663, 0.596, 0.839, 0.71, 0.647, 0.717, 0.604, 0.525, 0.759, 0.631, 0.561, 0.883, 0.741, 0.671, 0.836, 0.706, 0.635, 0.195, 0.157, 0.129, 0.196, 0.165, 0.137, 0.243, 0.196, 0.165],
              "images": ["video.mp4/frame_5"]
          },
          "cluster_6": {
              "centroid": [0.725, 0.632, 0.549, 0.872, 0.771, 0.706, 0.452, 0.392, 0.337, 0.453, 0.378, 0.325, 0.452, 0.391, 0.343, 0.425, 0.356, 0.299, 0.422, 0.353, 0.297, 0.494, 0.416, 0.351, 0.52, 0.439, 0.373, 0.859, 0.725, 0.631, 0.784, 0.658, 0.588, 0.863, 0.726, 0.638, 0.819, 0.694, 0.618, 0.881, 0.746, 0.67, 0.831, 0.716, 0.634, 0.825, 0.699, 0.626, 0.771, 0.674, 0.607, 0.742, 0.648, 0.569, 0.769, 0.658, 0.589, 0.728, 0.603, 0.523, 0.766, 0.643, 0.565, 0.839, 0.715, 0.633, 0.883, 0.741, 0.659, 0.871, 0.739, 0.664, 0.182, 0.154, 0.131, 0.139, 0.117, 0.098, 0.161, 0.137, 0.114],
              "images": ["video.mp4/frame_6"]
          },
          "cluster_7": {
              "centroid": [0.841, 0.728, 0.64, 0.596, 0.528, 0.456, 0.523, 0.444, 0.379, 0.398, 0.332, 0.284, 0.544, 0.463, 0.4, 0.461, 0.378, 0.315, 0.345, 0.279, 0.233, 0.406, 0.323, 0.278, 0.353, 0.287, 0.24, 0.788, 0.67, 0.598, 0.732, 0.597, 0.538, 0.803, 0.703, 0.62, 0.451, 0.376, 0.323, 0.678, 0.588, 0.519, 0.497, 0.413, 0.347, 0.69, 0.605, 0.531, 0.806, 0.693, 0.616, 0.701, 0.598, 0.525, 0.554, 0.463, 0.4, 0.691, 0.574, 0.505, 0.843, 0.734, 0.653, 0.833, 0.723, 0.642, 0.793, 0.677, 0.6, 0.179, 0.145, 0.118, 0.166, 0.133, 0.109, 0.177, 0.145, 0.118],
              "images": ["video.mp4/frame_7"]
          },
          "cluster_8": {
              "centroid": [0.941, 0.682, 0.62, 0.784, 0.384, 0.506, 0.506, 0.341, 0.247, 0.729, 0.525, 0.431, 0.82, 0.655, 0.561, 0.914, 0.816, 0.729, 0.749, 0.49, 0.353, 0.631, 0.38, 0.275, 0.718, 0.439, 0.329, 0.251, 0.224, 0.192, 0.729, 0.584, 0.549, 0.945, 0.894, 0.859, 0.902, 0.839, 0.78, 0.267, 0.227, 0.18, 0.596, 0.498, 0.471, 0.945, 0.824, 0.745, 0.886, 0.682, 0.537, 0.624, 0.353, 0.29, 0.91, 0.643, 0.553, 0.714, 0.314, 0.267, 0.851, 0.494, 0.42, 0.906, 0.573, 0.494, 0.941, 0.682, 0.62, 0.784, 0.384, 0.337, 0.149, 0.106, 0.082, 0.376, 0.251, 0.2, 0.592, 0.431, 0.361],
              "images": ["video.mp4/frame_8"]
          },
          "cluster_9": {
              "centroid": [ 0.117, 0.098, 0.161, 0.872, 0.771, 0.706, 0.452, 0.392, 0.337, 0.453, 0.378, 0.325, 0.452, 0.391, 0.343, 0.425, 0.356, 0.299, 0.422, 0.353, 0.297, 0.494, 0.416, 0.351, 0.52, 0.439, 0.373, 0.859, 0.725, 0.631, 0.784, 0.658, 0.588, 0.863, 0.726, 0.638, 0.819, 0.694, 0.618, 0.881, 0.746, 0.67, 0.831, 0.716, 0.634, 0.825, 0.699, 0.626, 0.771, 0.674, 0.607, 0.742, 0.648, 0.569, 0.769, 0.658, 0.589, 0.728, 0.603, 0.523, 0.766, 0.643, 0.565, 0.839, 0.715, 0.633, 0.883, 0.741, 0.659, 0.871, 0.739, 0.664, 0.182, 0.154, 0.131, 0.139, 0.117, 0.098, 0.161, 0.137, 0.114],
              "images": ["video.mp4/frame_9"]
          },
          "cluster_10": {
              "centroid": [ 0.523, 0.766, 0.643, 0.565, 0.839, 0.715, 0.633, 0.883, 0.337, 0.453, 0.378, 0.325, 0.452, 0.391, 0.343, 0.425, 0.356, 0.299, 0.422, 0.353, 0.297, 0.494, 0.416, 0.351, 0.52, 0.439, 0.373, 0.859, 0.725, 0.631, 0.784, 0.658, 0.588, 0.863, 0.726, 0.638, 0.819, 0.694, 0.618, 0.881, 0.746, 0.67, 0.831, 0.716, 0.634, 0.825, 0.699, 0.626, 0.771, 0.674, 0.607, 0.742, 0.648, 0.569, 0.769, 0.658, 0.589, 0.728, 0.603, 0.523, 0.766, 0.643, 0.565, 0.839, 0.715, 0.633, 0.883, 0.741, 0.659, 0.871, 0.739, 0.664, 0.182, 0.154, 0.131, 0.139, 0.117, 0.098, 0.161, 0.137, 0.114],
              "images": ["video.mp4/frame_10"]
          },
          "cluster_11": {
              "centroid": [0.486, 0.416, 0.359, 0.682, 0.569, 0.502, 0.42, 0.448, 0.38, 0.511, 0.432, 0.372, 0.508, 0.432, 0.365, 0.42, 0.353, 0.298, 0.409, 0.329, 0.282, 0.55, 0.452, 0.381, 0.506, 0.42, 0.359, 0.567, 0.48, 0.416, 0.471, 0.404, 0.345, 0.486, 0.416, 0.359, 0.682, 0.569, 0.502, 0.42, 0.812, 0.69, 0.616, 0.75, 0.63, 0.561, 0.836, 0.71, 0.639, 0.814, 0.686, 0.612, 0.799, 0.663, 0.596, 0.839, 0.71, 0.647, 0.717, 0.604, 0.525, 0.759, 0.631, 0.561, 0.883, 0.741, 0.671, 0.836, 0.706, 0.635, 0.195, 0.157, 0.129, 0.196, 0.165, 0.137, 0.243, 0.196, 0.165],
              "images": ["video.mp4/frame_11"]
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
  "name": "Dataset",
  "tags": ["data science", "AI", "deep learning"]
}
```
##### Risposta
```json
{
    "isDeleted": false,
    "id": 3,
    "name": "Dataset",
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

### Get all datasets by user id
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
        "name": "Dataset 1",
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
        "name": "Dataset 2",
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

### Get all datasets
**GET** http://localhost:3000/api/datasets/admin

### Descrizione
Consente all'admin di ottenere tutti i datasets presenti all'interno del database.

#### Authorization
Per eseguire questa rotta è necessario che l'admin abbia effettuato l'accesso tramite JWT.
- `Auth Type`: Bearer Token.
- `Token`: token JWT.

#### Parametri della Risposta
Può essere un JSONArray contenente informazioni su tutti datasets.
- `id`: Id assegnato al dataset
- `userId`: Id dell'admin
- `name`: Nome del dataset
- `tags`: Tags del dataset
- `isDeleted`: Può restituire *true* o *false* in relazione al fatto se il dataset sia stato eliminato o meno
- `createdAt`: Quando è stato creato
- `updatedAt`: Quando è stato aggiornato

#### Esempio
##### Rotta
**GET** http://localhost:3000/api/datasets/admin

##### Risposta
```json
[
    {
        "id": 1,
        "userId": 1,
        "name": "Dataset 1",
        "tags": [
            "tag1",
            "tag2"
        ],
        "isDeleted": false,
        "createdAt": "2024-07-11T08:54:15.000Z",
        "updatedAt": "2024-07-11T08:54:15.000Z"
    },
    {
        "id": 2,
        "userId": 2,
        "name": "Dataset 2",
        "tags": [
            "tag3",
            "tag4"
        ],
        "isDeleted": false,
        "createdAt": "2024-07-11T08:54:15.000Z",
        "updatedAt": "2024-07-11T08:54:15.000Z"
    },
    {
        "id": 3,
        "userId": 1,
        "name": "Dataset 3",
        "tags": [
            "data science",
            "AI",
            "deep learning"
        ],
        "isDeleted": false,
        "createdAt": "2024-07-11T11:21:27.000Z",
        "updatedAt": "2024-07-11T11:21:27.000Z"
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
  "name": "Dataset aggiornato",
  "tags": ["ML", "IA"]
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
- `data`: Di tipo *File* consente di caricare un file a scelta tra *zip, jpg, png, mp4*.
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
