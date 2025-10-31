// routes/api/events/index.ts
import { Router } from 'express';
import ticketsRouter from './tickets.js'

const EventticketsApiRouter = Router();

// 2. Mount the nested tickets router
// This connects the tickets logic to the event ID parameter
// The full path becomes: /api/events/:eventId/tickets or /api/events/:eventId/book
EventticketsApiRouter.use('/', ticketsRouter);

export default EventticketsApiRouter;