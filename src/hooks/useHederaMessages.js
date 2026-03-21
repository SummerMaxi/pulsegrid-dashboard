import { useState, useEffect, useCallback } from 'react';
import { TOPIC_ID, MIRROR_NODE, decodeMessage } from '../utils/hedera';

const POLL_INTERVAL = 15000;

export function useHederaMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      const url = `${MIRROR_NODE}/api/v1/topics/${TOPIC_ID}/messages?limit=50&order=desc`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const decoded = data.messages
        .map(decodeMessage)
        .filter(Boolean)
        .sort((a, b) => b.sequence_number - a.sequence_number);

      setMessages(decoded);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  return { messages, loading, error, lastUpdated, refetch: fetchMessages };
}
