import Dexie, { Table } from 'dexie';

export interface ChatMessage {
  id: string;
  channelId: string;
  senderName: string;
  avatarUrl?: string;
  content: string;
  timestamp: number;
  syncStatus: 'PENDING' | 'SYNCED' | 'FAILED';
  isAi?: boolean;
}

export class HSKBuddyDB extends Dexie {
  messages!: Table<ChatMessage>;

  constructor() {
    super('HSKBuddyDatabase');
    this.version(1).stores({
      messages: 'id, channelId, timestamp, syncStatus',
    });
  }
}

export const db = new HSKBuddyDB();
