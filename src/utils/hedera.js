export const TOPIC_ID = "0.0.8315150";
export const MIRROR_NODE = "https://testnet.mirrornode.hedera.com";
export const HASHSCAN_BASE = "https://hashscan.io/testnet";

export function decodeMessage(msg) {
  try {
    const decoded = JSON.parse(atob(msg.message));
    return {
      ...decoded,
      sequence_number: msg.sequence_number,
      consensus_timestamp: msg.consensus_timestamp,
    };
  } catch {
    return null;
  }
}

export function formatTimestamp(consensusTimestamp) {
  const seconds = parseFloat(consensusTimestamp);
  return new Date(seconds * 1000);
}

export function timeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  if (diffSecs < 60) return `${diffSecs}s ago`;
  const diffMins = Math.floor(diffSecs / 60);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}

export function getHashscanTxLink(consensusTimestamp) {
  return `${HASHSCAN_BASE}/transaction/${consensusTimestamp}`;
}

export function getHashscanTopicLink() {
  return `${HASHSCAN_BASE}/topic/${TOPIC_ID}`;
}
