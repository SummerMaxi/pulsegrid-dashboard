import { ExternalLink } from 'lucide-react';
import { formatTimestamp, timeAgo, getHashscanTxLink } from '../utils/hedera';

export default function LiveFeed({ messages }) {
  const items = messages.slice(0, 10);

  return (
    <div className="bg-[#FEFEFA] rounded-tl-[2rem] rounded-tr-[3rem] rounded-bl-[3rem] rounded-br-[2rem] border border-[#DED8CF]/50 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.1)] overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-lg font-bold text-[#2C2C24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          Live HCS Feed
        </h2>
        <p className="text-xs text-[#78786C] mt-0.5">Hedera Consensus Messages</p>
      </div>
      <div className="overflow-y-auto px-4 pb-4" style={{ maxHeight: '312px' }}>
        {items.map((msg) => {
          const date = formatTimestamp(msg.consensus_timestamp);
          const topBird = msg.biodiversity?.detections?.[0];
          return (
            <div
              key={msg.sequence_number}
              className="mb-2 p-3 rounded-2xl bg-[#F0EBE5]/50 border border-[#DED8CF]/30 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_-2px_rgba(93,112,82,0.1)] transition-all duration-300 animate-slide-in"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#78786C]">#{msg.sequence_number}</span>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-[#5D7052]/10 text-[#5D7052]">
                    {msg.node_id}
                  </span>
                </div>
                <span className="text-[10px] text-[#78786C] font-medium">{timeAgo(date)}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-[#4A4A40] flex-wrap">
                <span>SPL: <strong className="text-[#5D7052]">{msg.acoustics?.spl_dba?.toFixed(1)}</strong> dB</span>
                <span>ACI: <strong className="text-[#2C2C24]">{msg.acoustics?.ACI?.toFixed(1)}</strong></span>
                <span>NDSI: <strong className="text-[#2C2C24]">{msg.acoustics?.NDSI?.toFixed(3)}</strong></span>
                {topBird && (
                  <span className="text-[#5D7052] font-semibold">🐦 {topBird.species}</span>
                )}
                <a
                  href={getHashscanTxLink(msg.consensus_timestamp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-auto text-[#C18C5D] hover:text-[#A85448] transition-colors duration-300"
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
