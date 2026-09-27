import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, ChatMessage } from '../db/schema';

export const useChatSync = (channelId: string) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 1. Reactive live subscription to IndexedDB for this channel
  const messages = useLiveQuery(
    () => db.messages.where('channelId').equals(channelId).sortBy('timestamp'),
    [channelId]
  ) || [];

  // 2. Queue Processor (Flushes PENDING messages when back online)
  const flushPendingMessages = async () => {
    const pending = await db.messages
      .where({ channelId, syncStatus: 'PENDING' })
      .toArray();

    for (const msg of pending) {
      try {
        // Simulated WebSocket/REST dispatch delay:
        await new Promise((resolve) => setTimeout(resolve, 300));
        await db.messages.update(msg.id, { syncStatus: 'SYNCED' });
      } catch (error) {
        await db.messages.update(msg.id, { syncStatus: 'FAILED' });
      }
    }
  };

  // 3. Network Status Detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      flushPendingMessages();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [channelId]);

  // Seed default welcome message if channel is empty
  useEffect(() => {
    const seedDefaultMessages = async () => {
      const count = await db.messages.where('channelId').equals(channelId).count();
      if (count === 0) {
        await db.messages.add({
          id: 'welcome-seed-1',
          channelId,
          senderName: 'HSK Bot',
          content: `Welcome to #${channelId}! Messages sent here will persist offline in IndexedDB.`,
          timestamp: Date.now(),
          syncStatus: 'SYNCED',
          isAi: true,
        });
      }
    };
    seedDefaultMessages();
  }, [channelId]);

  // 4. Optimistic Action: Save locally first
  const sendMessage = async (content: string) => {
    const newMessage: ChatMessage = {
      id: crypto.randomUUID(),
      channelId,
      senderName: 'Learner',
      content,
      timestamp: Date.now(),
      syncStatus: navigator.onLine ? 'SYNCED' : 'PENDING',
    };

    await db.messages.add(newMessage);

    if (navigator.onLine) {
      // Background remote dispatch trigger
      flushPendingMessages();
    }
  };

  return {
    messages,
    sendMessage,
    isOnline,
  };
};
