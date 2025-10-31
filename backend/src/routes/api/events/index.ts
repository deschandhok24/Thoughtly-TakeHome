// routes/api/events/index.ts
import { Router } from 'express';
import EventticketsApiRouter from './tickets/index.js'; // Assumes tickets/index.ts is the default export
import router from './events.js'


const eventsApiRouter = Router();

eventsApiRouter.use('/', router);
eventsApiRouter.use('/', EventticketsApiRouter);

export default eventsApiRouter;