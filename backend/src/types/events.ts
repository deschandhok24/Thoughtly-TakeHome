// src/types/events.ts
import type { Event } from '@prisma/client';

export type EventWithVenueName = Event & { venueName: string };

export type GetAllEventsResult = {
  events: EventWithVenueName[];
  hasNext: boolean;
};