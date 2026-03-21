import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { timeAgo, formatTimestamp } from '../utils/hedera';

const CHENNAI = [13.0827, 80.2707];

function getSplColor(spl) {
  if (spl < 55) return '#22c55e';
  if (spl <= 70) return '#eab308';
  return '#ef4444';
}

export default function NodeMap({ messages }) {
  const latest = messages[0];
  const spl = latest?.acoustics?.spl_dba ?? 0;
  const color = getSplColor(spl);
  const lat = latest?.gps?.lat ?? CHENNAI[0];
  const lng = latest?.gps?.lng ?? CHENNAI[1];

  return (
    <div className="bg-[#1e293b] rounded-xl border border-slate-700/50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-700/50">
        <h2 className="text-sm font-semibold text-white">Node Map</h2>
      </div>
      <MapContainer
        center={CHENNAI}
        zoom={12}
        style={{ height: '300px', width: '100%' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
        {latest && (
          <CircleMarker
            center={[lat, lng]}
            radius={10}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.6, weight: 2 }}
          >
            <Popup>
              <div style={{ color: '#0f172a', fontSize: '13px', lineHeight: '1.5' }}>
                <strong>Node: {latest.node_id}</strong><br />
                SPL: {spl.toFixed(1)} dB<br />
                ACI: {latest.acoustics?.ACI?.toFixed(2)}<br />
                NDSI: {latest.acoustics?.NDSI?.toFixed(3)}<br />
                Last seen: {timeAgo(formatTimestamp(latest.consensus_timestamp))}
              </div>
            </Popup>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}
