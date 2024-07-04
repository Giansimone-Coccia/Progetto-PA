import express from 'express';
import routes from './src/routes/routes';

const app = express();

app.use(express.json());

// Rotte di autenticazione
app.use('/auth', routes);

// Utilizza le rotte definite in routes/routes.ts per tutte le altre richieste (protette)
app.use('/api', routes);

app.get('/', (req, res) => {
    console.log('Received request on /');
    res.json({ message: 'Docker is easy 👍' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on http://localhost:${port}`));
