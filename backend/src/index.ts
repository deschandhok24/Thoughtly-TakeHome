import express from 'express';
import cors from 'cors';
import { config } from './config/index.js'
import apiRouter from './routes/api/index.js'

const app = express();

// CORS configuration for React frontend
app.use(
  cors({
    origin: config.frontendUrl, // Update with your React dev server URL
    credentials: true, // Allow cookies to be sent
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter); // now your endpoint is GET /api/events
//app.use('/api', ticketsRouter)

import listEndpoints from "express-list-endpoints";

console.log(listEndpoints(app));

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Backend API running on ${PORT}`);
});