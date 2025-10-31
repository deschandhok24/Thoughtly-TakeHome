// server/routes/events.js
import express from 'express';
import {getAllEvents } from '../../../service/eventsService.js'
import { z } from 'zod';

const router = express.Router();

const querySchema = z.object({
  page: z.string().transform(Number),
  limit: z.string().transform(Number),
});

router.get('/', async (req, res) => {
  try {
    const {page, limit} = querySchema.parse(req.query);
    const eventData = await getAllEvents(page, limit);
    res.json(eventData);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request', details: err.errors });
    }
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
