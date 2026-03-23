import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatTimestamp } from '../utils/hedera';

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const data = payload[0]?.payload;
  return (
    <div className="bg-[#FEFEFA] border border-[#DED8CF] rounded-2xl p-4 shadow-[0_10px_40px_-10px_rgba(193,140,93,0.2)]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <p className="text-[#78786C] text-xs font-medium mb-1.5">{data?.fullTime}</p>
      <p className="text-[#5D7052] text-sm font-bold">SPL: {data?.spl?.toFixed(1)} dB</p>
      <p className="text-[#C18C5D] text-sm font-bold">ACI: {data?.aci?.toFixed(2)}</p>
      <p className="text-[#A85448] text-sm font-bold">NDSI: {data?.ndsi?.toFixed(3)}</p>
    </div>
  );
}

export default function AcousticChart({ messages }) {
  // Get unique dates from messages
  const availableDates = useMemo(() => {
    const dates = new Set();
    messages.forEach((msg) => {
      const ts = msg.consensus_timestamp || msg.timestamp;
      if (ts) {
        const date = formatTimestamp(ts);
        if (date && !isNaN(date)) {
          dates.add(date.toLocaleDateString('en-CA')); // YYYY-MM-DD format
        }
      }
    });
    return Array.from(dates).sort().reverse();
  }, [messages]);

  const [selectedDate, setSelectedDate] = useState('all');

  const chartData = useMemo(() => {
    let filtered = messages;

    if (selectedDate !== 'all') {
      filtered = messages.filter((msg) => {
        const ts = msg.consensus_timestamp || msg.timestamp;
        if (!ts) return false;
        const date = formatTimestamp(ts);
        if (!date || isNaN(date)) return false;
        return date.toLocaleDateString('en-CA') === selectedDate;
      });
    } else {
      filtered = messages.slice(0, 30);
    }

    return filtered
      .slice()
      .reverse()
      .map((msg) => {
        const ts = msg.consensus_timestamp || msg.timestamp;
        const date = ts ? formatTimestamp(ts) : new Date();
        return {
          time: date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
          fullTime: date.toLocaleString(),
          spl: msg.acoustics?.spl_dba ?? 0,
          aci: msg.acoustics?.ACI ?? 0,
          aciScaled: (msg.acoustics?.ACI ?? 0) / 10,
          ndsi: msg.acoustics?.NDSI ?? 0,
          ndsiScaled: (msg.acoustics?.NDSI ?? 0) * 50,
        };
      });
  }, [messages, selectedDate]);

  const formatDateLabel = (dateStr) => {
    if (dateStr === 'all') return 'Latest 30';
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-[#FEFEFA] rounded-[2rem] border border-[#DED8CF]/50 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.1)] p-6">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-[#2C2C24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          Acoustic Trends
        </h2>
        <div className="flex items-center gap-2">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-xs font-semibold text-[#78786C] bg-[#F0EBE5]/60 border border-[#DED8CF]/50 rounded-xl px-3 py-1.5 cursor-pointer hover:border-[#5D7052]/50 transition-colors outline-none"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            <option value="all">Latest 30</option>
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {formatDateLabel(date)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-xs text-[#78786C] mb-6">Sound pressure, complexity & biophony over time</p>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[280px] text-sm text-[#78786C]">
          No data for this date
        </div>
      ) : (
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
      )}
    </div>
  );
}
