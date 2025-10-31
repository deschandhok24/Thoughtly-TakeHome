import React, { useEffect, useState } from 'react';
import { fetchEvents } from '../api/fetchEvents';
import { EventWithVenueName } from '../types/event';
import EventCard from '../components/EventCard';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<EventWithVenueName[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const limit = 10;

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      try {
        const { events, hasNext } = await fetchEvents(page, limit);
        setEvents(events);
        setHasNext(hasNext);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadEvents();
  }, [page]);

  if (loading) return <div>Loading events...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Upcoming Events</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </ul>
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        {page > 1 && (
          <button onClick={() => setPage((p) => p - 1)}>Prev</button>
        )}
        {hasNext && (
          <button onClick={() => setPage((p) => p + 1)}>Next</button>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
