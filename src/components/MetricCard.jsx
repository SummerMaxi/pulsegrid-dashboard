import { TrendingUp, TrendingDown } from 'lucide-react';

const RADII = [
  'rounded-[2rem]',
  'rounded-tl-[3rem] rounded-tr-[1.5rem] rounded-bl-[1.5rem] rounded-br-[2.5rem]',
  'rounded-tl-[1.5rem] rounded-tr-[2.5rem] rounded-bl-[3rem] rounded-br-[1.5rem]',
  'rounded-tl-[2.5rem] rounded-tr-[1.5rem] rounded-bl-[1.5rem] rounded-br-[3rem]',
  'rounded-tl-[1.5rem] rounded-tr-[3rem] rounded-bl-[2.5rem] rounded-br-[1.5rem]',
];

export default function MetricCard({ title, value, unit, icon: Icon, trend, index = 0 }) {
  const radius = RADII[index % RADII.length];

  return (
    <div className={`group bg-[#FEFEFA] ${radius} p-5 border border-[#DED8CF]/50 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.1)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(93,112,82,0.15)] transition-all duration-500`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] text-[#78786C] uppercase tracking-wider font-semibold">{title}</span>
        <div className="h-10 w-10 rounded-2xl bg-[#5D7052]/10 flex items-center justify-center group-hover:bg-[#5D7052] transition-all duration-300">
          <Icon size={18} className="text-[#5D7052] group-hover:text-white transition-colors duration-300" />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-[#2C2C24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          {value}
        </span>
        {unit && <span className="text-sm text-[#78786C] mb-1 font-medium">{unit}</span>}
      </div>
      {trend !== undefined && trend !== null && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-semibold ${trend >= 0 ? 'text-[#5D7052]' : 'text-[#A85448]'}`}>
          {trend >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          <span>{trend >= 0 ? '+' : ''}{trend.toFixed(2)}</span>
        </div>
      )}
    </div>
  );
}
