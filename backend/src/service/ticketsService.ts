// db/tickets.ts
import prisma from '../db/index.js';
import { TicketTier, TicketStatus } from '@prisma/client'
import { Prisma } from '@prisma/client';
import type { AvailableTickets } from '../types/tickets.js';
import { TicketError } from '../errors/TicketError.js';

/**
 * Get tickets for a specific event by tier
 */
export const getAvailableTickets = async (
  eventId: string
): Promise<AvailableTickets> => {
  const ticketsPerTier = await prisma.ticket.groupBy({
    by: ['tier'],
    where: { eventId, status: TicketStatus.available },
    _count: { id: true },
  });

  const result: AvailableTickets = {
    VIP: 0,
    FrontRow: 0,
    GA: 0,
  };

  ticketsPerTier.forEach((t) => {
    result[t.tier] = t._count.id;
  });

  return result;
};

/**
 * Get all available tickets for a specific event, section, and tier
 */
export const bookTickets = async ({
  eventId,
  VIP,
  FrontRow,
  GA,
}: {
  eventId: string;
  VIP: number;
  FrontRow: number;
  GA: number;
}): Promise<void> => {
  return await prisma.$transaction(async (tx) => {
    const requests = [
      { tier: 'VIP', quantity: VIP },
      { tier: 'FrontRow', quantity: FrontRow },
      { tier: 'GA', quantity: GA },
    ].filter(r => r.quantity > 0);

    let bookedTickets: { id: string }[] = [];

    // Potential con is to make 3 roundtrips to db, each query is fast because its indexed.
    const queries = requests.map(({ tier, quantity }) =>
      tx.$queryRaw<{ id: string; tier: TicketTier }[]>`
        SELECT id
        FROM "Ticket"
        WHERE "eventId" = ${eventId}
          AND "tier" = ${Prisma.raw(`'${tier}'`)}
          AND "status" = ${TicketStatus.available}::"TicketStatus"
        LIMIT ${quantity}
        FOR UPDATE SKIP LOCKED
      `
    );

    const results = await Promise.all(queries);

    // Flatten results and validate quantities
    results.forEach((tickets, idx) => {
      const { tier, quantity } = requests[idx];
      if (tickets.length < quantity) {
        throw new TicketError(`Not enough tickets available for ${tier}. Found ${tickets.length}, needed ${quantity}`);
      }
      bookedTickets.push(...tickets);
    });


    const ids = bookedTickets.map((t) => t.id);
    await tx.ticket.updateMany({
      where: { id: { in: ids } },
      data: { status: TicketStatus.sold },
    });
  });
};