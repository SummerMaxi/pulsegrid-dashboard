import { ExternalLink } from 'lucide-react';
import { formatTimestamp, timeAgo, getHashscanTxLink } from '../utils/hedera';

export default function LiveFeed({ messages }) {
  const items = messages.slice(0, 10);

  return (
    <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/50">
        <h2 className="text-sm font-semibold text-white">Live HCS Feed</h2>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: '300px' }}>
        {items.map((msg) => {
          const date = formatTimestamp(msg.consensus_timestamp);
          return (
            <div
              key={msg.sequence_number}
              className="px-4 py-3 border-b border-slate-700/30 border-l-2 border-l-green-500 hover:bg-slate-700/20 transition animate-slide-in"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500">#{msg.sequence_number}</span>
                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-green-500/20 text-green-400">
                    {msg.node_id}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">{timeAgo(date)}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap">
                <span>SPL: <strong className="text-white">{msg.acoustics?.spl_dba?.toFixed(1)}</strong> dB</span>
                <span>ACI: <strong className="text-white">{msg.acoustics?.ACI?.toFixed(1)}</strong></span>
                <span>NDSI: <strong className="text-white">{msg.acoustics?.NDSI?.toFixed(3)}</strong></span>
                {msg.biodiversity?.detections?.[0] && (
                  <span className="text-green-400">🐦 {msg.biodiversity.detections[0].species}</span>
                )}
                <a
                  href={getHashscanTxLink(msg.consensus_timestamp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-[#8259EF] hover:text-[#a78bfa] transition"
                >
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
