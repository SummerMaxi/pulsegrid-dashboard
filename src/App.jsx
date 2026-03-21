import { Activity, MessageSquare, Volume2, Leaf, Loader2 } from 'lucide-react';
import { useHederaMessages } from './hooks/useHederaMessages';
import Header from './components/Header';
import MetricCard from './components/MetricCard';
import NodeMap from './components/NodeMap';
import LiveFeed from './components/LiveFeed';
import AcousticChart from './components/AcousticChart';
import TransactionList from './components/TransactionList';

export default function App() {
  const { messages, loading, error, lastUpdated, refetch } = useHederaMessages();

  if (loading && messages.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#8259EF] mx-auto mb-4" />
          <p className="text-slate-400 text-sm">Connecting to Hedera...</p>
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

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <Header lastUpdated={lastUpdated} onRefresh={refetch} loading={loading} />

      {error && (
        <div className="mx-6 mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
          Error: {error}
        </div>
      )}

      <main className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Nodes Online" value="1" icon={Activity} />
          <MetricCard title="Messages Today" value={messages.length} icon={MessageSquare} />
          <MetricCard title="Avg SPL" value={avgSpl.toFixed(1)} unit="dB" icon={Volume2} trend={splTrend} />
          <MetricCard title="Latest NDSI" value={latest?.acoustics?.NDSI?.toFixed(3) ?? '—'} icon={Leaf} trend={ndsiTrend} />
        </div>

        {/* Map + Live Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NodeMap messages={messages} />
          <LiveFeed messages={messages} />
        </div>

        {/* Acoustic Chart */}
        <AcousticChart messages={messages} />

        {/* Transaction List */}
        <TransactionList messages={messages} />

        {/* Footer */}
        <footer className="text-center text-xs text-slate-600 pb-4">
          PulseGrid — Decentralized Acoustic Monitoring on Hedera · Apex Hackathon 2026
        </footer>
      </main>
    </div>
  );
}
