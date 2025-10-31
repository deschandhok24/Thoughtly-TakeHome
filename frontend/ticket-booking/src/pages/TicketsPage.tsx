import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TicketCard from '../components/TicketCard';
import { TicketsAvailable, TicketTier } from '../types/TicketsAvailable';
import { fetchEventTicketCount } from '../api/fetchEventTicketCount';
import { bookTicket } from '../api/bookTicket';

const TicketsPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [error, setError] = useState<string | null>(null);
  const [available, setAvailable] = useState<TicketsAvailable>({
    VIP: 0,
    FrontRow: 0,
    GA: 0,
  });
  const [selected, setSelected] = useState<TicketsAvailable>({
    VIP: 0,
    FrontRow: 0,
    GA: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        if (!eventId) 
          setError('Invalid event. Please try again.');
        else {
          const data = await fetchEventTicketCount(eventId);
          setAvailable(data);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch tickets. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [eventId]);

  const increment = (tier: TicketTier) => {
    setSelected((prev) => {
      const max = available[tier];
      if (prev[tier] < max) return { ...prev, [tier]: prev[tier] + 1 };
      return prev;
    });
  };

  const decrement = (tier: TicketTier) => {
    setSelected((prev) => {
      if (prev[tier] > 0) return { ...prev, [tier]: prev[tier] - 1 };
      return prev;
    });
  };

  const totalSelected = Object.values(selected).reduce((acc, val) => acc + val, 0);

  const handleBooking = async () => {
    try {
      setError(null);
      if (!eventId)
        setError('Event not found. Please try again');
      else {
        await bookTicket(eventId, selected);
        navigate('/success');
      }
    } catch (err: any) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Unexpected error during booking');
      }
    }
  };

  if (loading) return <div>Loading tickets...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Buy Tickets</h1>

      {error && (
        <div
          style={{
            backgroundColor: '#f8d7da',
            color: '#721c24',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px',
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '20px' }}>
        {Object.entries(available).map(([tier, count]) => (
          <TicketCard
            key={tier}
            tier={tier as TicketTier}
            available={count}
            selected={selected[tier as TicketTier]}
            onIncrement={increment}
            onDecrement={decrement}
          />
        ))}
      </div>

      <button
        onClick={handleBooking}
        disabled={totalSelected === 0}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: totalSelected === 0 ? '#ccc' : '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: totalSelected === 0 ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
        }}
      >
        Checkout
      </button>
    </div>
  );
};

export default TicketsPage;