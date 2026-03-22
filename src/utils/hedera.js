export const TOPIC_ID = "0.0.8315150";
export const MIRROR_NODE = "https://testnet.mirrornode.hedera.com";
export const HASHSCAN_BASE = "https://hashscan.io/testnet";

/**
 * Reassemble chunked messages and decode single messages.
 * Chunked messages share the same initial_transaction_id and must be
 * concatenated in chunk order before base64 decoding.
 */
export function reassembleAndDecode(rawMessages) {
  const singleMessages = [];
  const chunkGroups = {};

  for (const msg of rawMessages) {
    const chunk = msg.chunk_info;
    if (!chunk || chunk.total === 1) {
      // Single (non-chunked) message
      const decoded = decodePayload(msg.message);
      if (decoded) {
        singleMessages.push({
          ...decoded,
          sequence_number: msg.sequence_number,
          consensus_timestamp: msg.consensus_timestamp,
        });
      }
    } else {
      // Chunked message — group by initial transaction ID
      const txId = chunk.initial_transaction_id;
      const key = `${txId.account_id}@${txId.transaction_valid_start}`;
      if (!chunkGroups[key]) {
        chunkGroups[key] = {
          total: chunk.total,
          parts: [],
          // Use the last chunk's metadata for the reassembled message
          lastSeqNum: msg.sequence_number,
          lastTimestamp: msg.consensus_timestamp,
        };
      }
      chunkGroups[key].parts.push({
        number: chunk.number,
        message: msg.message,
        sequence_number: msg.sequence_number,
        consensus_timestamp: msg.consensus_timestamp,
      });
      // Track the highest sequence number (last chunk)
      if (msg.sequence_number > chunkGroups[key].lastSeqNum) {
        chunkGroups[key].lastSeqNum = msg.sequence_number;
        chunkGroups[key].lastTimestamp = msg.consensus_timestamp;
      }
    }
  }

  // Reassemble complete chunk groups
  for (const key of Object.keys(chunkGroups)) {
    const group = chunkGroups[key];
    // Only process if we have all chunks
    if (group.parts.length !== group.total) continue;

    // Sort by chunk number and concatenate base64 parts
    group.parts.sort((a, b) => a.number - b.number);
    const combined = group.parts.map((p) => p.message).join('');

    const decoded = decodePayload(combined);
    if (decoded) {
      singleMessages.push({
        ...decoded,
        sequence_number: group.lastSeqNum,
        consensus_timestamp: group.lastTimestamp,
      });
    }
  }

  return singleMessages.sort((a, b) => b.sequence_number - a.sequence_number);
}

/**
 * Decode a base64 message payload, handling double-encoding.
 */
function decodePayload(base64Str) {
  try {
    // Decode base64 to string
    const raw = atob(base64Str);
    let parsed = JSON.parse(raw);
    // Handle double-encoded messages (string inside JSON)
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    return parsed;
  } catch {
    // If standard atob fails, try decoding concatenated chunks as UTF-8
    try {
      const bytes = Uint8Array.from(atob(base64Str), (c) => c.charCodeAt(0));
      const raw = new TextDecoder().decode(bytes);
      let parsed = JSON.parse(raw);
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      return parsed;
    } catch {
      return null;
    }
  }
}

// Keep for backward compat but primary path now uses reassembleAndDecode
export function decodeMessage(msg) {
  try {
    let decoded = JSON.parse(atob(msg.message));
    if (typeof decoded === 'string') {
      decoded = JSON.parse(decoded);
    }
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
