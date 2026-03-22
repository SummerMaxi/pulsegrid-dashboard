import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Clock, BarChart3, Eye } from 'lucide-react';
import { formatTimestamp, timeAgo } from '../utils/hedera';

const SORT_OPTIONS = [
  { key: 'detections', label: 'Most Detected' },
  { key: 'confidence', label: 'Highest Confidence' },
  { key: 'recent', label: 'Most Recent' },
  { key: 'name', label: 'A → Z' },
];

const CONFIDENCE_FILTERS = [
  { key: 'all', label: 'All', min: 0 },
  { key: 'high', label: 'High (>80%)', min: 0.8 },
  { key: 'medium', label: 'Medium (50–80%)', min: 0.5, max: 0.8 },
  { key: 'low', label: 'Low (<50%)', min: 0, max: 0.5 },
];

const CARD_RADII = [
  '2rem 1.5rem 2.5rem 1.5rem',
  '1.5rem 2.5rem 1.5rem 3rem',
  '2.5rem 1.5rem 3rem 1.5rem',
  '1.5rem 3rem 1.5rem 2rem',
  '3rem 1.5rem 2rem 2.5rem',
  '2rem 2.5rem 1.5rem 3rem',
];

function buildSpeciesStats(messages) {
  const map = {};

  messages.forEach((msg) => {
    msg.biodiversity?.detections?.forEach((d) => {
      if (!map[d.species]) {
        map[d.species] = {
          species: d.species,
          scientific: d.scientific,
          detections: 0,
          confidences: [],
          times: [],
          timestamps: [],
        };
      }
      const entry = map[d.species];
      entry.detections++;
      entry.confidences.push(d.confidence);
      entry.times.push(d.time);
      entry.timestamps.push(msg.consensus_timestamp);
    });
  });

  return Object.values(map).map((s) => ({
    ...s,
    avgConfidence: s.confidences.reduce((a, b) => a + b, 0) / s.confidences.length,
    maxConfidence: Math.max(...s.confidences),
    minConfidence: Math.min(...s.confidences),
    lastSeen: s.timestamps[0],
    lastTime: s.times[0],
  }));
}

export default function SpeciesDashboard({ messages }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('detections');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [expanded, setExpanded] = useState(null);

  const allSpecies = useMemo(() => buildSpeciesStats(messages), [messages]);

  const filtered = useMemo(() => {
    let result = allSpecies;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) => s.species.toLowerCase().includes(q) || s.scientific.toLowerCase().includes(q)
      );
    }

    // Confidence filter
    const cf = CONFIDENCE_FILTERS.find((f) => f.key === confidenceFilter);
    if (cf && cf.key !== 'all') {
      result = result.filter((s) => {
        if (cf.max !== undefined) return s.avgConfidence >= cf.min && s.avgConfidence < cf.max;
        return s.avgConfidence >= cf.min;
      });
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'detections': return b.detections - a.detections;
        case 'confidence': return b.avgConfidence - a.avgConfidence;
        case 'recent': return parseFloat(b.lastSeen) - parseFloat(a.lastSeen);
        case 'name': return a.species.localeCompare(b.species);
        default: return 0;
      }
    });

    return result;
  }, [allSpecies, search, sortBy, confidenceFilter]);

  const totalDetections = allSpecies.reduce((s, sp) => s + sp.detections, 0);
  const avgAllConfidence = allSpecies.length > 0
    ? allSpecies.reduce((s, sp) => s + sp.avgConfidence, 0) / allSpecies.length
    : 0;

  return (
    <div className="bg-[#FEFEFA] rounded-[2rem] border border-[#DED8CF]/50 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.1)] p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#2C2C24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            Species Catalogue
          </h2>
          <p className="text-xs text-[#78786C] mt-1">
            All bird species identified through acoustic analysis
          </p>
        </div>
        {/* Summary stats */}
        <div className="flex gap-3">
          <div className="px-4 py-2 rounded-full bg-[#5D7052]/10 flex items-center gap-2">
            <Eye size={14} className="text-[#5D7052]" />
            <span className="text-xs font-bold text-[#5D7052]">{allSpecies.length} species</span>
          </div>
          <div className="px-4 py-2 rounded-full bg-[#C18C5D]/10 flex items-center gap-2">
            <BarChart3 size={14} className="text-[#C18C5D]" />
            <span className="text-xs font-bold text-[#C18C5D]">{totalDetections} detections</span>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78786C]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search species..."
            className="w-full h-12 pl-11 pr-4 rounded-full border border-[#DED8CF] bg-white/50 text-sm text-[#2C2C24] placeholder-[#78786C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D7052]/30 focus-visible:ring-offset-2 transition-all duration-300"
          />
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <ArrowUpDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78786C] pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-12 pl-10 pr-6 rounded-full border border-[#DED8CF] bg-white/50 text-sm text-[#2C2C24] appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D7052]/30 focus-visible:ring-offset-2 transition-all duration-300"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* Confidence filter */}
        <div className="relative">
          <SlidersHorizontal size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78786C] pointer-events-none" />
          <select
            value={confidenceFilter}
            onChange={(e) => setConfidenceFilter(e.target.value)}
            className="h-12 pl-10 pr-6 rounded-full border border-[#DED8CF] bg-white/50 text-sm text-[#2C2C24] appearance-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5D7052]/30 focus-visible:ring-offset-2 transition-all duration-300"
          >
            {CONFIDENCE_FILTERS.map((f) => (
              <option key={f.key} value={f.key}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-xs text-[#78786C] mb-4 font-medium">
        Showing {filtered.length} of {allSpecies.length} species
      </p>

      {/* Species grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#78786C] text-sm">No species match your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((sp, i) => {
            const pct = Math.round(sp.avgConfidence * 100);
            const isHigh = sp.avgConfidence > 0.8;
            const barColor = isHigh ? '#5D7052' : sp.avgConfidence >= 0.5 ? '#C18C5D' : '#A85448';
            const badgeClass = isHigh
              ? 'bg-[#5D7052]/10 text-[#5D7052]'
              : sp.avgConfidence >= 0.5
                ? 'bg-[#C18C5D]/10 text-[#C18C5D]'
                : 'bg-[#A85448]/10 text-[#A85448]';
            const isOpen = expanded === sp.species;
            const lastDate = sp.lastSeen ? formatTimestamp(sp.lastSeen) : null;

            return (
              <div
                key={sp.species}
                className={`bg-[#F0EBE5]/40 border border-[#DED8CF]/40 p-5 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(93,112,82,0.15)] transition-all duration-500 cursor-pointer ${isOpen ? 'shadow-[0_10px_40px_-10px_rgba(93,112,82,0.15)]' : ''}`}
                style={{ borderRadius: CARD_RADII[i % CARD_RADII.length] }}
                onClick={() => setExpanded(isOpen ? null : sp.species)}
              >
                {/* Top row */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="h-12 w-12 rounded-2xl bg-[#5D7052]/10 flex items-center justify-center shrink-0 text-xl">
                    🐦
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-base font-bold text-[#2C2C24] truncate" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                      {sp.species}
                    </p>
                    <p className="text-[11px] text-[#78786C] italic truncate">{sp.scientific}</p>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${badgeClass}`}>
                    {pct}% avg
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#E6DCCD]/60 text-[#4A4A40]">
                    {sp.detections}× detected
                  </span>
                  {lastDate && (
                    <span className="text-[10px] text-[#78786C] flex items-center gap-1 ml-auto">
                      <Clock size={10} /> {timeAgo(lastDate)}
                    </span>
                  )}
                </div>

                {/* Confidence bar */}
                <div className="w-full h-2 bg-[#DED8CF]/50 rounded-full overflow-hidden mb-1">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, backgroundColor: barColor }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-[#78786C] font-medium">
                  <span>Min: {Math.round(sp.minConfidence * 100)}%</span>
                  <span>Max: {Math.round(sp.maxConfidence * 100)}%</span>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="mt-4 pt-4 border-t border-[#DED8CF]/40 animate-slide-in">
                    <p className="text-xs font-semibold text-[#2C2C24] mb-2">Recent detections</p>
                    <div className="space-y-1.5">
                      {sp.times.slice(0, 5).map((t, j) => (
                        <div key={j} className="flex items-center justify-between text-xs">
                          <span className="text-[#4A4A40]">{t}</span>
                          <span className={`font-bold ${sp.confidences[j] > 0.8 ? 'text-[#5D7052]' : sp.confidences[j] >= 0.5 ? 'text-[#C18C5D]' : 'text-[#A85448]'}`}>
                            {Math.round(sp.confidences[j] * 100)}%
                          </span>
                        </div>
                      ))}
                    </div>
                    {sp.detections > 5 && (
                      <p className="text-[10px] text-[#78786C] mt-2">
                        + {sp.detections - 5} more detections
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
