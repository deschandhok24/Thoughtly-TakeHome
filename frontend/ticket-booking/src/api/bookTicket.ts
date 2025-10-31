// src/api/events.ts
import axios from 'axios';
import { TicketsAvailable } from '../types/TicketsAvailable';
import config from '../config';

export const bookTicket = async (eventId: string, tiers: TicketsAvailable) => {
    try {
        // event/:eventId/book
        return await axios.put(`${config.API_URL}/api/events/${eventId}/book`, {
            tiers,
        });
        // Optionally, refetch availability
    } catch (err) {
      console.log(err);
      throw err;
    }
};