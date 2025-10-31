export enum TicketTier {
  VIP = 'VIP',
  FrontRow = 'FrontRow',
  GA = 'GA',
}

export interface TicketsAvailable {
  [TicketTier.VIP]: number;
  [TicketTier.FrontRow]: number;
  [TicketTier.GA]: number;
}