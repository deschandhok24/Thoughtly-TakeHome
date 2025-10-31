import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      padding: '60px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#28a745', fontSize: '2rem' }}>🎉 Booking Successful!</h1>
      <p style={{ fontSize: '1.2rem', marginTop: '20px' }}>
        Your tickets have been successfully booked.
      </p>

      <button
        onClick={() => navigate('/')}
        style={{
          marginTop: '30px',
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 'bold',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default SuccessPage;