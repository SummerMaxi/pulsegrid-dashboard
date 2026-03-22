import { Activity, MessageSquare, Volume2, Leaf, Bird, Loader2 } from 'lucide-react';
import { useHederaMessages } from './hooks/useHederaMessages';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import NodeMap from './components/NodeMap';
import LiveFeed from './components/LiveFeed';
import AcousticChart from './components/AcousticChart';
import TransactionList from './components/TransactionList';
import BiodiversityPanel from './components/BiodiversityPanel';
import SpeciesDashboard from './components/SpeciesDashboard';
import TrustChainPanel from './components/TrustChainPanel';

function BlobBg({ className, color }) {
  return (
    <div
      className={`absolute pointer-events-none blur-3xl opacity-30 ${className}`}
      style={{
        backgroundColor: color,
        borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
        width: '400px',
        height: '400px',
      }}
    />
  );
}

export default function App() {
  const { messages, loading, error, lastUpdated, refetch } = useHederaMessages();

  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 rounded-full bg-[#5D7052]/10 flex items-center justify-center mx-auto mb-5">
            <Loader2 size={28} className="animate-spin text-[#5D7052]" />
          </div>
          <p className="text-[#78786C] text-sm font-medium">Connecting to Hedera...</p>
          <p className="text-[#DED8CF] text-xs mt-1">Listening to the forest</p>
        </div>
      </div>
    );
  }

  const latest = messages[0];
  const prev = messages[1];

  const avgSpl = messages.length > 0
    ? messages.slice(0, 10).reduce((sum, m) => sum + (m.acoustics?.spl_dba ?? 0), 0) / Math.min(messages.length, 10)
    : 0;

  const splTrend = latest && prev
    ? (latest.acoustics?.spl_dba ?? 0) - (prev.acoustics?.spl_dba ?? 0)
    : null;

  const ndsiTrend = latest && prev
    ? (latest.acoustics?.NDSI ?? 0) - (prev.acoustics?.NDSI ?? 0)
    : null;

  const uniqueSpecies = new Set();
  messages.forEach((m) => {
    m.biodiversity?.detections?.forEach((d) => uniqueSpecies.add(d.species));
  });

  return (
    <div className="min-h-screen bg-[#FDFCF8] relative overflow-hidden">
      {/* Ambient blobs */}
      <BlobBg color="#5D7052" className="-top-40 -right-40 animate-blob" />
      <BlobBg color="#C18C5D" className="top-1/3 -left-60 animate-blob-delayed" />
      <BlobBg color="#E6DCCD" className="bottom-40 right-20 animate-blob" />

      <div className="relative z-10">
        <Header lastUpdated={lastUpdated} onRefresh={refetch} loading={loading} />

        {error && (
          <div className="mx-4 sm:mx-6 lg:mx-8 mt-6 p-4 rounded-2xl bg-[#A85448]/10 border border-[#A85448]/20 text-[#A85448] text-sm font-medium">
            Connection issue: {error}
          </div>
        )}

        <main className="px-4 sm:px-6 lg:px-8 py-8 space-y-8 max-w-7xl mx-auto">
          {/* Hero tagline */}
          <div className="text-center py-6">
            <h2 className="text-4xl md:text-5xl font-bold text-[#2C2C24] tracking-tight" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
              Listen to the Earth
            </h2>
            <p className="text-[#78786C] mt-3 text-base max-w-lg mx-auto">
              Decentralized bioacoustic DMRV from Chennai — Verifiable Credentials on Hedera.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
            <MetricCard title="Nodes Online" value="1" icon={Activity} index={0} />
            <MetricCard title="Messages" value={messages.length} icon={MessageSquare} index={1} />
            <MetricCard title="Avg SPL" value={avgSpl.toFixed(1)} unit="dB" icon={Volume2} trend={splTrend} index={2} />
            <MetricCard title="Latest NDSI" value={latest?.acoustics?.NDSI?.toFixed(3) ?? '—'} icon={Leaf} trend={ndsiTrend} index={3} />
            <MetricCard title="Species" value={uniqueSpecies.size} icon={Bird} index={4} />
          </div>

          {/* Map + Live Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            <NodeMap messages={messages} />
            <LiveFeed messages={messages} />
          </div>

          {/* Bird Detections */}
          <BiodiversityPanel messages={messages} />

          {/* Species Catalogue */}
          <SpeciesDashboard messages={messages} />

          {/* DMRV Trust Chain */}
          <TrustChainPanel messages={messages} />

          {/* Acoustic Chart */}
          <AcousticChart messages={messages} />

          {/* Transaction List */}
          <TransactionList messages={messages} />

          {/* Footer */}
          <footer className="text-center py-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-lg">🐝</span>
              <span className="text-sm font-bold text-[#2C2C24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                PulseGrid
              </span>
            </div>
            <p className="text-xs text-[#78786C]">
              Decentralized Bioacoustic DMRV on Hedera · Apex Hackathon 2026
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
