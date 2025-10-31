// src/api/events.ts
import axios from 'axios';
import { EventMetadata } from '../types/event';
import config from '../config';

export const fetchEvents = async (page: number, limit: number, startDate?: string): Promise<EventMetadata> => {
  const params: any = { page, limit };
  if (startDate) params.startDate = startDate;

  const { data } = await axios.get<EventMetadata>(`${config.API_URL}/api/events`, { params });
  return data;
};