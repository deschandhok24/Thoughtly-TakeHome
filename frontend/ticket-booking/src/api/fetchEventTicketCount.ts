// src/api/events.ts
import axios from 'axios';
import { TicketsAvailable } from '../types/TicketsAvailable';
import config from '../config';

export const fetchEventTicketCount = async (eventId: string): Promise<TicketsAvailable> => {
  const { data } = await axios.get<TicketsAvailable>(`${config.API_URL}/api/events/${eventId}/tickets`);
  return data;
};

