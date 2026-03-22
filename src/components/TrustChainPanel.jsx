import { Shield, Link, FileCheck, Cpu, Hash, Fingerprint } from 'lucide-react';

export default function TrustChainPanel({ messages }) {
  const vcMessages = messages.filter((m) => m._isVC);
  const latest = vcMessages[0];

  if (!latest) {
    return (
      <div className="bg-[#FEFEFA] rounded-[2rem] border border-[#DED8CF]/50 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.1)] p-6">
        <h2 className="text-lg font-bold text-[#2C2C24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
          DMRV Trust Chain
        </h2>
        <p className="text-sm text-[#78786C] mt-2">Waiting for Verifiable Credential payloads...</p>
      </div>
    );
  }

  const vc = latest._vc || {};
  const methodology = latest.methodology || {};
  const proof = latest.proof || {};
  const issuer = latest.issuer || {};
  const tc = latest.trustChain || {};
  const es = latest.ecosystem_services || {};

  return (
    <div className="bg-[#FEFEFA] rounded-[2rem] border border-[#DED8CF]/50 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.1)] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-[#2C2C24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            DMRV Trust Chain
          </h2>
          <p className="text-xs text-[#78786C] mt-0.5">
            W3C Verifiable Credentials anchored to Hedera
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 text-[10px] font-bold rounded-full bg-[#5D7052]/10 text-[#5D7052]">
            Guardian Compatible
          </span>
          <span className="px-3 py-1.5 text-[10px] font-bold rounded-full bg-[#C18C5D]/10 text-[#C18C5D]">
            {vcMessages.length} VCs
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credential Info */}
        <div className="space-y-4">
          <div className="bg-[#F0EBE5]/40 border border-[#DED8CF]/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-[#5D7052]" />
              <span className="text-xs font-bold text-[#2C2C24] uppercase tracking-wider">Verifiable Credential</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#78786C]">Type</span>
                <span className="text-[#2C2C24] font-semibold">BioacousticDMRVReport</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78786C]">Issuer DID</span>
                <span className="text-[#5D7052] font-mono text-[10px]">{issuer.id || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78786C]">Node Type</span>
                <span className="text-[#2C2C24] font-semibold">{issuer.type || 'DMRVNode'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78786C]">Issued</span>
                <span className="text-[#2C2C24] font-semibold">
                  {latest.timestamp ? new Date(latest.timestamp).toLocaleString() : '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Methodology */}
          <div className="bg-[#F0EBE5]/40 border border-[#DED8CF]/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <FileCheck size={16} className="text-[#C18C5D]" />
              <span className="text-xs font-bold text-[#2C2C24] uppercase tracking-wider">DMRV Methodology</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#78786C]">ID</span>
                <span className="text-[#2C2C24] font-mono font-semibold">{methodology.id || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78786C]">Name</span>
                <span className="text-[#2C2C24] font-semibold text-right max-w-[200px]">{methodology.name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78786C]">Detection Model</span>
                <span className="text-[#2C2C24] font-semibold text-right max-w-[200px]">{methodology.detection_model || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78786C]">Interval</span>
                <span className="text-[#2C2C24] font-semibold">{methodology.measurement_interval_minutes || 10} min</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Chain + Hardware + Ecosystem */}
        <div className="space-y-4">
          {/* Trust Chain */}
          <div className="bg-[#F0EBE5]/40 border border-[#DED8CF]/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Link size={16} className="text-[#5D7052]" />
              <span className="text-xs font-bold text-[#2C2C24] uppercase tracking-wider">Trust Chain</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#78786C]">Sequence</span>
                <span className="text-[#5D7052] font-bold text-base">#{tc.sequence || '—'}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-[#78786C]">Previous Hash</span>
                <span className="text-[#2C2C24] font-mono text-[10px] max-w-[180px] truncate">
                  {tc.previousHash || 'Genesis (none)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78786C]">Proof Type</span>
                <span className="text-[#2C2C24] font-semibold">{proof.type || 'HederaConsensusService'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#78786C]">Topic</span>
                <span className="text-[#C18C5D] font-mono font-semibold">{proof.topicId || '—'}</span>
              </div>
            </div>
          </div>

          {/* Hardware Attestation */}
          <div className="bg-[#F0EBE5]/40 border border-[#DED8CF]/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={16} className="text-[#C18C5D]" />
              <span className="text-xs font-bold text-[#2C2C24] uppercase tracking-wider">Hardware Attestation</span>
            </div>
            <div className="space-y-2 text-xs">
              {issuer.hardware ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-[#78786C]">Platform</span>
                    <span className="text-[#2C2C24] font-semibold">{issuer.hardware.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78786C]">Sensor</span>
                    <span className="text-[#2C2C24] font-semibold">{issuer.hardware.sensor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78786C]">AI Engine</span>
                    <span className="text-[#2C2C24] font-semibold text-right max-w-[200px]">{issuer.hardware.ai_engine}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#78786C]">GPS</span>
                    <span className="text-[#2C2C24] font-semibold">{issuer.hardware.gps}</span>
                  </div>
                </>
              ) : (
                <p className="text-[#78786C]">Legacy payload — no hardware attestation</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ecosystem Services */}
      {es.soundscape_quality && (
        <div className="mt-6 bg-[#F0EBE5]/40 border border-[#DED8CF]/40 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Fingerprint size={16} className="text-[#5D7052]" />
            <span className="text-xs font-bold text-[#2C2C24] uppercase tracking-wider">Ecosystem Services (SEEA-aligned)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-white/60 rounded-xl">
              <p className="text-[10px] text-[#78786C] uppercase tracking-wider font-semibold mb-1">Soundscape Quality</p>
              <p className="text-sm font-bold text-[#5D7052]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                {es.soundscape_quality?.ndsi_classification?.replace(/_/g, ' ') || '—'}
              </p>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-xl">
              <p className="text-[10px] text-[#78786C] uppercase tracking-wider font-semibold mb-1">Biodiversity</p>
              <p className="text-sm font-bold text-[#C18C5D]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                {es.biodiversity_indicator?.adi_classification?.replace(/_/g, ' ') || '—'}
              </p>
              <p className="text-[10px] text-[#78786C] mt-0.5">{es.biodiversity_indicator?.species_richness ?? 0} species</p>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-xl">
              <p className="text-[10px] text-[#78786C] uppercase tracking-wider font-semibold mb-1">Ecosystem Complexity</p>
              <p className="text-sm font-bold text-[#A85448]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                ACI {es.ecosystem_complexity?.aci_value?.toFixed(1) || '—'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chain visualization */}
      {vcMessages.length > 1 && (
        <div className="mt-6">
          <p className="text-xs font-bold text-[#2C2C24] uppercase tracking-wider mb-3">Recent Chain</p>
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {vcMessages.slice(0, 12).reverse().map((m, i) => (
              <div key={m.sequence_number} className="flex items-center shrink-0">
                <div
                  className="w-8 h-8 rounded-lg bg-[#5D7052]/10 border border-[#5D7052]/30 flex items-center justify-center text-[10px] font-bold text-[#5D7052] hover:bg-[#5D7052] hover:text-white transition-all duration-300 cursor-default"
                  title={`Sequence #${m.trustChain?.sequence || '?'} | Seq ${m.sequence_number}`}
                >
                  {m.trustChain?.sequence || '?'}
                </div>
                {i < Math.min(vcMessages.length, 12) - 1 && (
                  <div className="w-4 h-0.5 bg-[#DED8CF]" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
