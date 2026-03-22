import { RefreshCw, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { getHashscanTopicLink } from '../utils/hedera';

export default function Header({ lastUpdated, onRefresh, loading }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50 mx-4 sm:mx-6 lg:mx-8 mt-4">
      <nav className="bg-white/70 backdrop-blur-md border border-[#DED8CF]/50 rounded-full px-6 py-3 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.1)] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[#5D7052] flex items-center justify-center shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)]">
            <span className="text-lg">🐝</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-[#2C2C24] tracking-tight" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              PulseGrid
            </h1>
            <p className="text-[10px] text-[#78786C] -mt-0.5 font-medium">DMRV Bioacoustic Network</p>
          </div>
        </div>

        {/* Desktop nav items */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={getHashscanTopicLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 text-xs font-bold rounded-full border-2 border-[#C18C5D] text-[#C18C5D] hover:bg-[#C18C5D] hover:text-white transition-all duration-300"
          >
            Hedera Testnet
          </a>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#5D7052]/10">
            <span className="w-2 h-2 rounded-full bg-[#5D7052] animate-pulse-moss" />
            <span className="text-xs font-bold text-[#5D7052]">LIVE</span>
          </div>

          {lastUpdated && (
            <span className="text-xs text-[#78786C] font-medium">
              {lastUpdated.toLocaleTimeString()}
            </span>
          )}

          <button
            onClick={onRefresh}
            disabled={loading}
            className="h-10 w-10 rounded-full bg-[#F0EBE5] hover:bg-[#5D7052] hover:text-white text-[#5D7052] flex items-center justify-center transition-all duration-300 disabled:opacity-50 active:scale-95"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden h-10 w-10 rounded-full bg-[#F0EBE5] flex items-center justify-center text-[#5D7052]"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-2 mx-2 bg-white/90 backdrop-blur-md border border-[#DED8CF]/50 rounded-[2rem] p-6 shadow-[0_10px_40px_-10px_rgba(93,112,82,0.15)] animate-slide-in">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#5D7052] animate-pulse-moss" />
              <span className="text-sm font-bold text-[#5D7052]">LIVE</span>
              {lastUpdated && (
                <span className="text-xs text-[#78786C] ml-auto">{lastUpdated.toLocaleTimeString()}</span>
              )}
            </div>
            <a
              href={getHashscanTopicLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-bold rounded-full border-2 border-[#C18C5D] text-[#C18C5D] text-center hover:bg-[#C18C5D] hover:text-white transition-all duration-300"
            >
              Hedera Testnet
            </a>
            <button
              onClick={() => { onRefresh(); setMenuOpen(false); }}
              disabled={loading}
              className="px-4 py-2 text-sm font-bold rounded-full bg-[#5D7052] text-[#F3F4F1] hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-50"
            >
              <RefreshCw size={14} className={`inline mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
