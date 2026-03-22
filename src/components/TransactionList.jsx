import { ExternalLink } from 'lucide-react';
import { formatTimestamp, getHashscanTxLink } from '../utils/hedera';

export default function TransactionList({ messages }) {
  const items = messages.slice(0, 20);

  return (
    <div className="bg-[#FEFEFA] rounded-[2rem] border border-[#DED8CF]/50 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.1)] overflow-hidden">
      <div className="px-6 py-5">
        <h2 className="text-lg font-bold text-[#2C2C24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          Hedera Transactions
        </h2>
        <p className="text-xs text-[#78786C] mt-0.5">Verifiable on-chain records</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#78786C] border-t border-b border-[#DED8CF]/50">
              <th className="px-6 py-3 font-semibold text-xs">Seq#</th>
              <th className="px-6 py-3 font-semibold text-xs">Time</th>
              <th className="px-6 py-3 font-semibold text-xs">SPL (dB)</th>
              <th className="px-6 py-3 font-semibold text-xs">ACI</th>
              <th className="px-6 py-3 font-semibold text-xs">NDSI</th>
              <th className="px-6 py-3 font-semibold text-xs">Hashscan</th>
            </tr>
          </thead>
          <tbody>
            {items.map((msg, i) => {
              const date = formatTimestamp(msg.consensus_timestamp);
              return (
                <tr
                  key={msg.sequence_number}
                  className={`border-b border-[#DED8CF]/30 hover:bg-[#5D7052]/5 transition-colors duration-300 ${i % 2 === 0 ? 'bg-[#F0EBE5]/30' : ''}`}
                >
                  <td className="px-6 py-3 font-mono text-[#78786C] text-xs">#{msg.sequence_number}</td>
                  <td className="px-6 py-3 text-[#4A4A40] text-xs">{date.toLocaleTimeString('en-US', { hour12: false })}</td>
                  <td className="px-6 py-3 text-[#5D7052] font-bold text-xs">{msg.acoustics?.spl_dba?.toFixed(1)}</td>
                  <td className="px-6 py-3 text-[#C18C5D] font-semibold text-xs">{msg.acoustics?.ACI?.toFixed(2)}</td>
                  <td className="px-6 py-3 text-[#A85448] font-semibold text-xs">{msg.acoustics?.NDSI?.toFixed(3)}</td>
                  <td className="px-6 py-3">
                    <a
                      href={getHashscanTxLink(msg.consensus_timestamp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border-2 border-[#C18C5D] text-[#C18C5D] hover:bg-[#C18C5D] hover:text-white transition-all duration-300"
                    >
                      View <ExternalLink size={10} />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
