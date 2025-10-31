import React from 'react';
import { EventWithVenueName } from '../types/event';

interface Props {
  event: EventWithVenueName;
}

const EventCard: React.FC<Props> = ({ event }) => {
  return (
    <li
      key={event.id}
      style={{
        marginBottom: '20px',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      }}
    >
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '5px' }}>
        {event.name}
      </div>
      <div style={{ fontSize: '16px', marginBottom: '5px' }}>
        {event.venueName}
      </div>
      <div style={{ color: '#555', marginBottom: '10px' }}>
        {new Date(event.date).toLocaleDateString()}
      </div>
      <a
        href={`/tickets/${event.id}`}
        style={{
          padding: '8px 12px',
          backgroundColor: '#007bff',
          color: 'white',
          borderRadius: '5px',
          textDecoration: 'none',
          fontWeight: 'bold',
        }}
      >
        Buy Tickets
      </a>
    </li>
  );
};

export default EventCard;
