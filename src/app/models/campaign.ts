import { Client } from "./client";
export interface Campaign {
  id: string;
  client: Client;
  createdAt: Date | string;
  createdById?: string;
  createdByName?: string;
  days: number;
  status?: string;
  name?: string;
  price?: number;
  period?: string;
  mediaType?: string;
  
}

