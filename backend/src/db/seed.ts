import { TicketStatus, TicketTier } from '@prisma/client';
import prisma from './index.js';

async function main() {
  // Create some venues
  const venues = await prisma.venue.createMany({
    data: [
      { name: 'Madison Square Garden' },
      { name: 'The Forum' },
    ],
    skipDuplicates: true,
  });

  // Fetch all venues to get their IDs
  const allVenues = await prisma.venue.findMany();

  // Create events for each venue
  const eventsData = [];
  for (const venue of allVenues) {
    eventsData.push({
      name: 'Rock Concert',
      date: new Date('2025-12-15T20:00:00Z'),
      venueId: venue.id,
    });
    eventsData.push({
      name: 'Jazz Night',
      date: new Date('2025-12-20T19:30:00Z'),
      venueId: venue.id,
    });
  }

  const events = [];
  for (const eventData of eventsData) {
    const event = await prisma.event.create({ data: eventData });
    events.push(event);
  }

  // Generate tickets for each event
  for (const event of events) {
    const ticketsToCreate = [];

    // 5 VIP tickets
    for (let i = 0; i < 5; i++) {
      ticketsToCreate.push({
        eventId: event.id,
        tier: TicketTier.VIP,
        status: TicketStatus.available,
        price: 100,
        user: '',
      });
    }

    // 5 FrontRow tickets
    for (let i = 0; i < 5; i++) {
      ticketsToCreate.push({
        eventId: event.id,
        tier: TicketTier.FrontRow,
        status: TicketStatus.available,
        price: 50,
        user: '',
      });
    }

    // 10 GA tickets
    for (let i = 0; i < 10; i++) {
      ticketsToCreate.push({
        eventId: event.id,
        tier: TicketTier.GA,
        status: TicketStatus.available,
        price: 10,
        user: '',
      });
    }

    await prisma.ticket.createMany({
      data: ticketsToCreate,
    });
  }

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
