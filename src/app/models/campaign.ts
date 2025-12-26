import { Client } from "./client";
export interface Campaign {
  id: string;
  name?: string;
  client: Client;
  createdAt: Date | string;
  createdById?: string;
  createdByName?: string;
  days: number;
  status?: string;
  price?: number;
  period?: string;
  mediaType?: string;
  
}

