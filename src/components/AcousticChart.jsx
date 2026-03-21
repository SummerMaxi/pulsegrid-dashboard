import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatTimestamp } from '../utils/hedera';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="bg-[#1e293b] border border-slate-600 rounded-lg p-3 text-xs">
      <p className="text-slate-300 mb-1">{data?.time}</p>
      <p className="text-green-400">SPL: {data?.spl?.toFixed(1)} dB</p>
      <p className="text-blue-400">ACI: {data?.aci?.toFixed(2)}</p>
      <p className="text-[#8259EF]">NDSI: {data?.ndsi?.toFixed(3)}</p>
    </div>
  );
}

export default function AcousticChart({ messages }) {
  const chartData = messages
    .slice(0, 20)
    .reverse()
    .map((msg) => {
      const date = formatTimestamp(msg.consensus_timestamp);
      return {
        time: date.toLocaleTimeString('en-US', { hour12: false }),
        spl: msg.acoustics?.spl_dba ?? 0,
        aci: msg.acoustics?.ACI ?? 0,
        aciScaled: (msg.acoustics?.ACI ?? 0) / 10,
        ndsi: msg.acoustics?.NDSI ?? 0,
        ndsiScaled: (msg.acoustics?.NDSI ?? 0) * 50,
      };
    });

  return (
    <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 p-4">
      <h2 className="text-sm font-semibold text-white mb-4">Acoustic Trends</h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="time" tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => {
              const labels = { spl: 'SPL (dB)', aciScaled: 'ACI / 10', ndsiScaled: 'NDSI × 50' };
              return <span style={{ color: '#94a3b8', fontSize: 12 }}>{labels[value] || value}</span>;
            }}
          />
          <Line type="monotone" dataKey="spl" stroke="#22c55e" strokeWidth={2} dot={false} animationDuration={800} />
          <Line type="monotone" dataKey="aciScaled" stroke="#3b82f6" strokeWidth={2} dot={false} animationDuration={800} />
          <Line type="monotone" dataKey="ndsiScaled" stroke="#8259EF" strokeWidth={2} dot={false} animationDuration={800} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
