import prisma from '../db/index.js';
import type { GetAllEventsResult, EventWithVenueName } from '../types/events.js';

/**
 * Get all events
 * @param page page number (1-based)
 * @param limit number of items per page
 */
export const getAllEvents = async (
  page: number,
  limit: number,
): Promise<GetAllEventsResult> => {
  const where: any = {};
  const skip = (page - 1) * limit;

  const eventsRaw = await prisma.event.findMany({
    where,
    include: {
      venue: { select: { name: true } },
    },
    orderBy: { date: 'asc' },
    skip,
    take: limit+1,
  });

  const hasNext = eventsRaw.length > limit;
  if (hasNext) eventsRaw.pop(); // remove the extra item

    // Flatten venue name
  const events: EventWithVenueName[] = eventsRaw.map((e) => ({
    ...e,
    venueName: e.venue.name,
  }));

  return {events, hasNext}

};