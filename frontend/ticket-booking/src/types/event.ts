// src/types.ts
export interface Event {
  id: number;
  name: string;
  date: string; // or Date if you parse it
}

export type EventWithVenueName = Event & { venueName: string };

export interface EventMetadata {
    events: EventWithVenueName[]
    hasNext: boolean
}