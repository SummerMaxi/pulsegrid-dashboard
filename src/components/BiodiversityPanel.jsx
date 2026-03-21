export default function BiodiversityPanel({ messages }) {
  const latest = messages[0];
  const detections = (latest?.biodiversity?.detections ?? [])
    .slice()
    .sort((a, b) => b.confidence - a.confidence);

  if (detections.length === 0) {
    return (
      <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
        <h2 className="text-sm font-semibold text-white mb-3">Bird Detections</h2>
        <p className="text-slate-500 text-xs">No detections yet...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white">Bird Detections</h2>
        <span className="text-xs text-slate-500">
          {latest?.biodiversity?.species_count ?? 0} species total
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {detections.map((d, i) => {
          const pct = Math.round(d.confidence * 100);
          const isHigh = d.confidence > 0.8;
          const barColor = isHigh ? 'bg-green-500' : 'bg-yellow-500';
          const textColor = isHigh ? 'text-green-400' : 'text-yellow-400';

          return (
            <div
              key={`${d.species}-${i}`}
              className="bg-[#0f172a] rounded-lg p-3 border border-slate-700/30 animate-slide-in"
            >
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">🐦</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{d.species}</p>
                  <p className="text-[11px] text-slate-400 italic truncate">{d.scientific}</p>
                </div>
              </div>
              <div className="mb-1.5">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-medium ${textColor}`}>{pct}% confidence</span>
                  <span className="text-[10px] text-slate-500">{d.time}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
