const CARD_RADII = [
  { borderRadius: '2rem 1.5rem 2.5rem 1.5rem' },
  { borderRadius: '1.5rem 2.5rem 1.5rem 3rem' },
  { borderRadius: '2.5rem 1.5rem 3rem 1.5rem' },
  { borderRadius: '1.5rem 3rem 1.5rem 2rem' },
  { borderRadius: '3rem 1.5rem 2rem 2.5rem' },
  { borderRadius: '2rem 2.5rem 1.5rem 3rem' },
];

export default function BiodiversityPanel({ messages }) {
  const latest = messages[0];
  const detections = (latest?.biodiversity?.detections ?? [])
    .slice()
    .sort((a, b) => b.confidence - a.confidence);

  if (detections.length === 0) {
    return (
      <div className="bg-[#FEFEFA] rounded-[2rem] border border-[#DED8CF]/50 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.1)] p-6">
        <h2 className="text-lg font-bold text-[#2C2C24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          Bird Detections
        </h2>
        <p className="text-sm text-[#78786C] mt-2">Waiting for detections...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FEFEFA] rounded-[2rem] border border-[#DED8CF]/50 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.1)] p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#2C2C24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            Bird Detections
          </h2>
          <p className="text-xs text-[#78786C] mt-0.5">Latest species identified by acoustic analysis</p>
        </div>
        <span className="px-4 py-1.5 text-xs font-bold rounded-full bg-[#5D7052]/10 text-[#5D7052]">
          {latest?.biodiversity?.species_count ?? 0} species
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {detections.map((d, i) => {
          const pct = Math.round(d.confidence * 100);
          const isHigh = d.confidence > 0.8;
          const barColor = isHigh ? '#5D7052' : '#C18C5D';
          const badgeClass = isHigh
            ? 'bg-[#5D7052]/10 text-[#5D7052]'
            : 'bg-[#C18C5D]/10 text-[#C18C5D]';

          return (
            <div
              key={`${d.species}-${i}`}
              className="bg-[#F0EBE5]/40 border border-[#DED8CF]/40 p-4 hover:-translate-y-1 hover:shadow-[0_10px_40px_-10px_rgba(93,112,82,0.15)] transition-all duration-500 animate-slide-in"
              style={CARD_RADII[i % CARD_RADII.length]}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-2xl bg-[#5D7052]/10 flex items-center justify-center shrink-0 text-lg">
                  🐦
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#2C2C24] truncate" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                    {d.species}
                  </p>
                  <p className="text-[11px] text-[#78786C] italic truncate">{d.scientific}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeClass}`}>
                  {pct}% match
                </span>
                <span className="text-[10px] text-[#78786C] font-medium">{d.time}</span>
              </div>
              <div className="w-full h-2 bg-[#DED8CF]/50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
