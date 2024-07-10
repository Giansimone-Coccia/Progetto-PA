/**
 * @file server.ts
 * @description Entry point for the Express application, setting up routes, middleware, and error handling.
 */

import express from 'express';
import routes from './src/routes/routes';
import errorHandler from './src/middleware/errorMiddleware';

// Create an instance of Express
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * @description Define the routes for authentication
 * @route /auth
 */
app.use('/auth', routes);

/**
 * @description Use the routes defined in routes/routes.ts for all other requests (protected routes)
 * @route /api
 */
app.use('/api', routes);

/**
 * @description Root route to check server status
 * @route GET /
 * @returns {object} JSON message confirming the server is running
 */
app.get('/', (req, res) => {
    console.log('Received request on /');
    res.json({ message: 'Docker is easy 👍' });
});

/**
 * @description Middleware to handle errors
 */
app.use(errorHandler);

// Define the port on which the server will listen
const port = process.env.PORT || 3000;

/**
 * @description Start the server and listen on the specified port
 */
app.listen(port, () => console.log(`App listening on http://localhost:${port}`));
