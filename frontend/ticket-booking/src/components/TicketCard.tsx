import React from 'react';
import { TicketTier } from '../types/TicketsAvailable';

interface Props {
  tier: TicketTier;
  available: number;
  selected: number;
  onIncrement: (tier: TicketTier) => void;
  onDecrement: (tier: TicketTier) => void;
}

const TicketCard: React.FC<Props> = ({ tier, available, selected, onIncrement, onDecrement }) => {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        width: '150px',
        textAlign: 'center',
      }}
    >
      <h2>{tier}</h2>
      <p>Available: {available}</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '10px' }}>
        <button onClick={() => onDecrement(tier)} disabled={selected === 0}>-</button>
        <span>{selected}</span>
        <button onClick={() => onIncrement(tier)} disabled={selected === available}>+</button>
      </div>
    </div>
  );
};

export default TicketCard;