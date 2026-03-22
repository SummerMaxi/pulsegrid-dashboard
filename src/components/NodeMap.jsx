import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { timeAgo, formatTimestamp } from '../utils/hedera';

const CHENNAI = [13.0827, 80.2707];

function getSplColor(spl) {
  if (spl < 55) return '#5D7052';
  if (spl <= 70) return '#C18C5D';
  return '#A85448';
}

export default function NodeMap({ messages }) {
  const latest = messages[0];
  const spl = latest?.acoustics?.spl_dba ?? 0;
  const color = getSplColor(spl);
  const lat = latest?.gps?.lat ?? CHENNAI[0];
  const lng = latest?.gps?.lng ?? CHENNAI[1];

  return (
    <div className="bg-[#FEFEFA] rounded-tl-[3rem] rounded-tr-[2rem] rounded-bl-[2rem] rounded-br-[3rem] border border-[#DED8CF]/50 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.1)] overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-lg font-bold text-[#2C2C24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          Node Map
        </h2>
        <p className="text-xs text-[#78786C] mt-0.5">Chennai, India</p>
      </div>
      <div className="mx-4 mb-4 rounded-2xl overflow-hidden border border-[#DED8CF]/30">
        <MapContainer
          center={CHENNAI}
          zoom={12}
          style={{ height: '280px', width: '100%' }}
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
          {latest && (
            <CircleMarker
              center={[lat, lng]}
              radius={12}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.4, weight: 3 }}
            >
              <Popup>
                <div style={{ color: '#2C2C24', fontSize: '13px', lineHeight: '1.6', fontFamily: "'Nunito', sans-serif" }}>
                  <strong style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: '15px' }}>
                    {latest.node_id}
                  </strong><br />
                  <span style={{ color: '#5D7052' }}>SPL: {spl.toFixed(1)} dB</span><br />
                  Species: {latest.biodiversity?.species_count ?? 0} detected<br />
                  {latest.biodiversity?.detections?.[0] && (
                    <>🐦 {latest.biodiversity.detections[0].species}<br /></>
                  )}
                  <span style={{ color: '#78786C', fontSize: '11px' }}>
                    {timeAgo(formatTimestamp(latest.consensus_timestamp))}
                  </span>
                </div>
              </Popup>
            </CircleMarker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
