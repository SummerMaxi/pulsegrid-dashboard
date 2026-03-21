import { ExternalLink } from 'lucide-react';
import { formatTimestamp, getHashscanTxLink } from '../utils/hedera';

export default function TransactionList({ messages }) {
  const items = messages.slice(0, 20);

  return (
    <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/50">
        <h2 className="text-sm font-semibold text-white">Hedera Transactions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left text-slate-400 border-b border-slate-700/50">
              <th className="px-4 py-2 font-medium">Seq#</th>
              <th className="px-4 py-2 font-medium">Time</th>
              <th className="px-4 py-2 font-medium">SPL (dB)</th>
              <th className="px-4 py-2 font-medium">ACI</th>
              <th className="px-4 py-2 font-medium">NDSI</th>
              <th className="px-4 py-2 font-medium">Hashscan</th>
            </tr>
          </thead>
          <tbody>
            {items.map((msg, i) => {
              const date = formatTimestamp(msg.consensus_timestamp);
              return (
                <tr
                  key={msg.sequence_number}
                  className={`border-b border-slate-700/20 hover:bg-slate-700/20 transition ${i % 2 === 0 ? 'bg-slate-800/30' : ''}`}
                >
                  <td className="px-4 py-2 font-mono text-slate-300">#{msg.sequence_number}</td>
                  <td className="px-4 py-2 text-slate-300">{date.toLocaleTimeString('en-US', { hour12: false })}</td>
                  <td className="px-4 py-2 text-green-400 font-medium">{msg.acoustics?.spl_dba?.toFixed(1)}</td>
                  <td className="px-4 py-2 text-blue-400">{msg.acoustics?.ACI?.toFixed(2)}</td>
                  <td className="px-4 py-2 text-[#8259EF]">{msg.acoustics?.NDSI?.toFixed(3)}</td>
                  <td className="px-4 py-2">
                    <a
                      href={getHashscanTxLink(msg.consensus_timestamp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#8259EF] hover:text-[#a78bfa] transition inline-flex items-center gap-1"
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
