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
        const normalized = normalizeMessage({
          ...decoded,
          sequence_number: msg.sequence_number,
          consensus_timestamp: msg.consensus_timestamp,
        });
        singleMessages.push(normalized);
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

    // Sort by chunk number, decode each to bytes, concatenate, then parse
    group.parts.sort((a, b) => a.number - b.number);
    const decoded = decodeChunkedPayload(group.parts.map((p) => p.message));
    if (decoded) {
      const normalized = normalizeMessage({
        ...decoded,
        sequence_number: group.lastSeqNum,
        consensus_timestamp: group.lastTimestamp,
      });
      singleMessages.push(normalized);
    }
  }

  return singleMessages.sort((a, b) => b.sequence_number - a.sequence_number);
}

/**
 * Decode chunked message by decoding each base64 chunk to bytes,
 * concatenating, then parsing the combined string.
 */
function decodeChunkedPayload(base64Parts) {
  try {
    // Decode each chunk independently to avoid base64 padding issues
    const byteArrays = base64Parts.map((b64) => {
      const binary = atob(b64);
      return Uint8Array.from(binary, (c) => c.charCodeAt(0));
    });

    // Concatenate all byte arrays
    const totalLen = byteArrays.reduce((sum, arr) => sum + arr.length, 0);
    const combined = new Uint8Array(totalLen);
    let offset = 0;
    for (const arr of byteArrays) {
      combined.set(arr, offset);
      offset += arr.length;
    }

    // Decode bytes to string and parse
    const raw = new TextDecoder().decode(combined);
    let parsed = JSON.parse(raw);
    if (typeof parsed === 'string') {
      parsed = JSON.parse(parsed);
    }
    return parsed;
  } catch {
    return null;
  }
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

/**
 * Normalize a decoded message to a flat structure.
 * Handles both old flat payloads and new W3C Verifiable Credential payloads.
 */
export function normalizeMessage(msg) {
  // New VC format: data nested under credentialSubject
  if (msg.credentialSubject) {
    const cs = msg.credentialSubject;
    const mo = cs.measured_outcomes || {};
    const ai = mo.acoustic_indices || {};
    const bio = mo.biodiversity || {};
    const loc = cs.location || {};
    const tc = msg.trustChain || {};
    const es = cs.ecosystem_services || {};

    return {
      // Keep original VC fields for trust chain panel
      _isVC: true,
      _vc: msg,

      // Flat fields for existing components
      node_id: msg.issuer?.node_id || cs.id || 'PG-0001',
      node_name: msg.issuer?.name || '',
      timestamp: msg.issuanceDate,
      gps: {
        lat: loc.coordinates?.[1] ?? 13.0827,
        lng: loc.coordinates?.[0] ?? 80.2707,
        fixed: loc.gps_fixed ?? false,
      },
      acoustics: {
        spl_dba: ai.spl_dba ?? 0,
        ACI: ai.aci ?? 0,
        NDSI: ai.ndsi ?? 0,
        ADI: ai.adi ?? 0,
      },
      biodiversity: {
        species_count: bio.species_count ?? 0,
        window_minutes: bio.observation_window_minutes ?? 10,
        detections: bio.detections ?? [],
      },
      // Trust chain info
      trustChain: {
        sequence: tc.sequence,
        previousHash: tc.previousHash,
      },
      // Ecosystem services
      ecosystem_services: es,
      // Methodology
      methodology: cs.methodology,
      // Proof
      proof: msg.proof,
      // Issuer
      issuer: msg.issuer,

      // These get set by reassembleAndDecode
      sequence_number: msg.sequence_number,
      consensus_timestamp: msg.consensus_timestamp,
    };
  }

  // Old flat format — pass through as-is
  return { ...msg, _isVC: false };
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
