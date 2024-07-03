import express from 'express';
import routes from './src/routes/routes';  // Assicurati che il percorso sia corretto

const app = express();

app.use(express.json());

// Utilizza le rotte definite in routes/routes.ts
app.use('/api', routes);

app.get('/', (req, res) => {
    console.log('Received request on /');
    res.json({ message: 'Docker is easy 👍' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`App listening on http://localhost:${port}`));
