import { TrendingUp, TrendingDown } from 'lucide-react';

export default function MetricCard({ title, value, unit, icon: Icon, trend }) {
  return (
    <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-700/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-slate-400 uppercase tracking-wider">{title}</span>
        <Icon size={16} className="text-slate-500" />
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {unit && <span className="text-sm text-slate-400 mb-0.5">{unit}</span>}
      </div>
      {trend !== undefined && trend !== null && (
        <div className={`flex items-center gap-1 mt-1 text-xs ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          <span>{trend >= 0 ? '+' : ''}{trend.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
