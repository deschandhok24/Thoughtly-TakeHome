// types/tickets.ts
import { TicketTier } from '@prisma/client';

export type AvailableTickets = Record<TicketTier, number>;