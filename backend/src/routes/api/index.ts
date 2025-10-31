// routes/api/index.ts
import { Router } from 'express';
import eventsApiRouter from './events/index.js'; // Assumes events/index.ts is the default export

const eventRouter = Router();

eventRouter.use('/events', eventsApiRouter); 

export default eventRouter;