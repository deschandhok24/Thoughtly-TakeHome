import { bookTickets, getAvailableTickets } from '../../../../service/ticketsService.js'
import { z } from 'zod';
import { TicketTier } from "@prisma/client";
import { Router } from 'express';
import { TicketError } from '../../../../errors/TicketError.js';

const ticketsRouter = Router({ mergeParams: true });

const bodySchema = z.object({
  tiers: z.object({
    [TicketTier.VIP]: z.number().int().nonnegative(),
    [TicketTier.FrontRow]: z.number().int().nonnegative(),
    [TicketTier.GA]: z.number().int().nonnegative(),
  })
});

ticketsRouter.put('/:eventId/book', async (req, res) => {
  try {
    const { eventId } = req.params;

    const { tiers } = bodySchema.parse(req.body); // { VIP: 2, GA: 3, FrontRow: 0 }

    const resp = await bookTickets({ eventId, ...tiers });

    res.json(resp);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ error: 'Invalid request', details: err.errors });
    }

    // Catch custom ticket errors
    if (err instanceof TicketError) {
      return res.status(400).json({ error: err.message });
    }

    console.error(err);
    res.status(500).json({ error: 'Failed to process ticket purchase' });
  }
});


// Get available tickets for an event
ticketsRouter.get('/:eventId/tickets', async (req, res) => {
  try {
    const { eventId } = req.params;
    const ticket_by_tier = await getAvailableTickets(eventId);
    res.json(ticket_by_tier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

export default ticketsRouter;