import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatTimestamp } from '../utils/hedera';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="bg-[#FEFEFA] border border-[#DED8CF] rounded-2xl p-4 shadow-[0_10px_40px_-10px_rgba(193,140,93,0.2)]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <p className="text-[#78786C] text-xs font-medium mb-1.5">{data?.time}</p>
      <p className="text-[#5D7052] text-sm font-bold">SPL: {data?.spl?.toFixed(1)} dB</p>
      <p className="text-[#C18C5D] text-sm font-bold">ACI: {data?.aci?.toFixed(2)}</p>
      <p className="text-[#A85448] text-sm font-bold">NDSI: {data?.ndsi?.toFixed(3)}</p>
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
    <div className="bg-[#FEFEFA] rounded-[2rem] border border-[#DED8CF]/50 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.1)] p-6">
      <h2 className="text-lg font-bold text-[#2C2C24] mb-1" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
        Acoustic Trends
      </h2>
      <p className="text-xs text-[#78786C] mb-6">Sound pressure, complexity & biophony over time</p>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="4 4" stroke="#DED8CF" strokeOpacity={0.5} />
          <XAxis
            dataKey="time"
            tick={{ fill: '#78786C', fontSize: 11, fontFamily: "'Nunito', sans-serif" }}
            axisLine={{ stroke: '#DED8CF' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#78786C', fontSize: 11, fontFamily: "'Nunito', sans-serif" }}
            axisLine={{ stroke: '#DED8CF' }}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => {
              const labels = { spl: 'SPL (dB)', aciScaled: 'ACI / 10', ndsiScaled: 'NDSI × 50' };
              return <span style={{ color: '#78786C', fontSize: 12, fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>{labels[value] || value}</span>;
            }}
          />
          <Line type="natural" dataKey="spl" stroke="#5D7052" strokeWidth={2.5} dot={false} animationDuration={1000} />
          <Line type="natural" dataKey="aciScaled" stroke="#C18C5D" strokeWidth={2.5} dot={false} animationDuration={1000} />
          <Line type="natural" dataKey="ndsiScaled" stroke="#A85448" strokeWidth={2.5} dot={false} animationDuration={1000} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
