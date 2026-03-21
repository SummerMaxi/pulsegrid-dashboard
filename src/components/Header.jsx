import { RefreshCw } from 'lucide-react';
import { getHashscanTopicLink } from '../utils/hedera';

export default function Header({ lastUpdated, onRefresh, loading }) {
  return (
    <header className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-slate-700/50">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🐝</span>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">PulseGrid</h1>
          <p className="text-xs text-slate-400">Decentralized Acoustic Monitoring Network</p>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2 sm:mt-0">
        <a
          href={getHashscanTopicLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1 text-xs font-medium rounded-full bg-[#8259EF]/20 text-[#8259EF] border border-[#8259EF]/30 hover:bg-[#8259EF]/30 transition"
        >
          Hedera Testnet
        </a>

        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-green" />
          <span className="text-xs font-medium text-green-400">LIVE</span>
        </div>

        {lastUpdated && (
          <span className="text-xs text-slate-500">
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}

        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 rounded-lg hover:bg-slate-800 transition text-slate-400 hover:text-white disabled:opacity-50"
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
    </header>
  );
}
