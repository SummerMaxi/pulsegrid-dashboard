import { ArrowLeft, Volume2, Activity, Leaf, BarChart3, Bird, Shield, Link, FileCheck, Radio } from 'lucide-react';

const TERMS = [
  {
    term: 'SPL',
    fullName: 'Sound Pressure Level',
    unit: 'dB (decibels)',
    icon: Volume2,
    color: '#5D7052',
    description: 'Measures the overall loudness of the environment. Higher values mean louder surroundings.',
    howWeUseIt: 'PulseGrid records 10 seconds of audio every 10 minutes and computes the RMS (root mean square) amplitude, converted to a dB scale referenced to full-scale digital audio + 94 dB offset for approximate dBA.',
    interpretation: [
      { range: '< 40 dB', meaning: 'Very quiet — rural, undisturbed habitat' },
      { range: '40–55 dB', meaning: 'Quiet — suburban, light background noise' },
      { range: '55–70 dB', meaning: 'Moderate — urban environment, WHO health threshold at 55 dB' },
      { range: '> 70 dB', meaning: 'Loud — traffic, construction, potential noise pollution' },
    ],
    whyItMatters: 'The WHO estimates 1.6 million healthy life years are lost annually in Europe alone from noise pollution. SPL provides continuous, verifiable noise monitoring for urban planning, real estate valuation, and public health policy.',
  },
  {
    term: 'ACI',
    fullName: 'Acoustic Complexity Index',
    unit: 'Dimensionless (higher = more complex)',
    icon: Activity,
    color: '#C18C5D',
    description: 'Measures how complex and varied the soundscape is. Environments with many different sound sources (birds, insects, wind) score higher than monotone environments.',
    howWeUseIt: 'Audio is divided into frames of 512 samples. For each frame, a frequency spectrum is computed via FFT. The ACI sums the absolute differences between consecutive frequency bins, normalized by total spectral energy. Higher variation = higher ACI.',
    interpretation: [
      { range: '< 100', meaning: 'Low complexity — monotone, possibly degraded habitat' },
      { range: '100–200', meaning: 'Moderate complexity — typical mixed environment' },
      { range: '> 200', meaning: 'High complexity — rich, diverse soundscape with many biological sources' },
    ],
    whyItMatters: 'ACI was designed specifically to be robust against constant anthropogenic noise (like traffic). It captures the irregularity of biological sounds while ignoring steady-state noise. High ACI strongly correlates with species diversity in peer-reviewed studies.',
    reference: 'Pieretti, Farina & Morri (2011); Sueur et al. (2014)',
  },
  {
    term: 'NDSI',
    fullName: 'Normalized Difference Soundscape Index',
    unit: '-1 to +1',
    icon: Leaf,
    color: '#A85448',
    description: 'Measures the balance between biological sounds (biophony) and human-generated sounds (anthrophony). Positive values mean more nature; negative values mean more human noise.',
    howWeUseIt: 'The audio spectrum is split into two bands: anthrophony (200–1500 Hz, where most human noise occurs) and biophony (2000–8000 Hz, where most bird and insect sounds occur). NDSI = (biophony - anthrophony) / (biophony + anthrophony).',
    interpretation: [
      { range: '0.6 to 1.0', meaning: 'High biophony — healthy, nature-dominated soundscape' },
      { range: '0.2 to 0.6', meaning: 'Moderate biophony — mixed environment' },
      { range: '-0.2 to 0.2', meaning: 'Balanced — equal biological and anthropogenic sound' },
      { range: '-1.0 to -0.2', meaning: 'Anthropogenic dominated — degraded or urban environment' },
    ],
    whyItMatters: 'NDSI is the single best metric for quickly assessing whether an environment is dominated by nature or human activity. It is used in conservation to track ecosystem degradation and recovery over time.',
    reference: 'Kasten et al. (2012)',
  },
  {
    term: 'ADI',
    fullName: 'Acoustic Diversity Index',
    unit: 'Dimensionless (0 to ~2.5)',
    icon: BarChart3,
    color: '#5D7052',
    description: 'Measures how evenly sound energy is distributed across different frequency bands. Higher values indicate a more diverse soundscape with activity across many frequencies — a proxy for biodiversity.',
    howWeUseIt: 'The frequency spectrum (0–8000 Hz) is divided into 10 equal bands. The proportion of total energy in each band is computed, then the Shannon entropy formula is applied: ADI = -sum(p * ln(p)). Even distribution = high ADI.',
    interpretation: [
      { range: '> 1.5', meaning: 'High diversity — many frequency bands active, rich ecosystem' },
      { range: '1.0–1.5', meaning: 'Moderate diversity — some variation across frequency bands' },
      { range: '0.5–1.0', meaning: 'Low diversity — sound concentrated in few frequency bands' },
      { range: '< 0.5', meaning: 'Very low diversity — dominated by single sound source' },
    ],
    whyItMatters: 'ADI serves as an acoustic proxy for biodiversity. When many species are calling across different frequency ranges, ADI is high. Studies show strong correlation between ADI and traditional biodiversity surveys.',
    reference: 'Villanueva-Rivera, Pijanowski, Doucette & Pekin (2011)',
  },
  {
    term: 'BirdNET',
    fullName: 'BirdNET AI (Cornell Lab of Ornithology)',
    unit: 'Species name + confidence (0–100%)',
    icon: Bird,
    color: '#C18C5D',
    description: 'A deep learning model trained on hundreds of thousands of bird recordings that can identify 6,000+ bird species from audio alone.',
    howWeUseIt: 'BirdNET-Go runs continuously on the Raspberry Pi inside a Docker container, analyzing the live audio stream from the USB microphone. When it detects a bird call, it outputs the species name, scientific name, confidence score, and timestamp.',
    interpretation: [
      { range: '> 80%', meaning: 'High confidence — very likely correct identification' },
      { range: '50–80%', meaning: 'Medium confidence — probable identification, may need verification' },
      { range: '< 50%', meaning: 'Low confidence — possible detection, treat with caution' },
    ],
    whyItMatters: 'Species-level identification transforms raw acoustic data into actionable biodiversity intelligence. BirdNET enables automated, scalable biodiversity monitoring that would otherwise require expert ornithologists in the field.',
    reference: 'Kahl et al. (2021) — Cornell Lab of Ornithology',
  },
  {
    term: 'DMRV',
    fullName: 'Digital Measurement, Reporting, and Verification',
    unit: 'N/A — framework',
    icon: FileCheck,
    color: '#5D7052',
    description: 'A framework for using digital technologies (IoT sensors, AI, blockchain) to automate the measurement, reporting, and verification of environmental outcomes — replacing expensive, infrequent manual audits.',
    howWeUseIt: 'PulseGrid is a DMRV system. The Raspberry Pi is the measurement device, acoustic indices and species detection are the reporting, and Hedera HCS with W3C Verifiable Credentials is the verification layer. Methodology ID: PG-DMRV-BIO-001.',
    interpretation: [],
    whyItMatters: 'Traditional MRV for carbon and biodiversity credits costs $50,000–$100,000 per audit and happens once a year. DMRV automates this to every 10 minutes at near-zero marginal cost, with cryptographic proof of data integrity.',
  },
  {
    term: 'W3C VC',
    fullName: 'W3C Verifiable Credential',
    unit: 'N/A — data standard',
    icon: Shield,
    color: '#A85448',
    description: 'A W3C international standard for expressing credentials (claims about a subject) in a way that is cryptographically verifiable and tamper-evident. Used for identity, academic credentials, and increasingly for environmental claims.',
    howWeUseIt: 'Every 10-minute PulseGrid observation is structured as a W3C Verifiable Credential with an issuer DID (did:hedera:testnet:...), credential subject (the DMRV observation), methodology reference, ecosystem services valuation, and proof anchored to Hedera HCS.',
    interpretation: [],
    whyItMatters: 'VCs solve the trust problem in environmental data. Anyone can verify the credential, check who issued it, inspect the methodology, and audit the entire trust chain — without trusting any single intermediary.',
  },
  {
    term: 'Trust Chain',
    fullName: 'Hash-Linked Trust Chain',
    unit: 'SHA-256 hashes',
    icon: Link,
    color: '#C18C5D',
    description: 'Each PulseGrid observation includes the SHA-256 hash of the previous observation, creating a sequential, tamper-evident chain. If any observation is modified, all subsequent hashes break — making tampering immediately detectable.',
    howWeUseIt: 'After each successful publish to HCS, the payload is hashed with SHA-256. The hash is stored locally and included in the next observation as "previousHash". This creates a blockchain-like chain anchored to Hedera consensus timestamps.',
    interpretation: [],
    whyItMatters: 'For biodiversity credits, carbon credits, and insurance, the entire history of environmental monitoring data must be auditable and tamper-proof. The trust chain provides this guarantee without requiring trust in the node operator.',
  },
  {
    term: 'DePIN',
    fullName: 'Decentralized Physical Infrastructure Network',
    unit: 'N/A — network model',
    icon: Radio,
    color: '#5D7052',
    description: 'A model where physical hardware (sensors, nodes, devices) is deployed and operated by a decentralized community of participants, with data and coordination managed on a blockchain.',
    howWeUseIt: 'PulseGrid is a DePIN — anyone can buy a node (~$105), deploy it anywhere, and contribute verified biodiversity data to the network. Each node gets its own Hedera account, DID, and HOL agent registration.',
    interpretation: [],
    whyItMatters: 'DePIN solves the scaling problem for environmental monitoring. Instead of one organization deploying sensors everywhere, thousands of participants deploy nodes in their own locations — creating global coverage at a fraction of the cost.',
  },
];

export default function GlossaryPage({ onBack }) {
  return (
    <div className="min-h-screen bg-[#FDFCF8] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-semibold text-[#5D7052] hover:text-[#2C2C24] transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-[#2C2C24] tracking-tight" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
            Glossary of Terms
          </h1>
          <p className="text-[#78786C] mt-2 text-base">
            Understanding the science behind PulseGrid's bioacoustic monitoring
          </p>
        </div>

        {/* Terms */}
        <div className="space-y-6">
          {TERMS.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.term}
                id={t.term.toLowerCase().replace(/\s+/g, '-')}
                className="bg-[#FEFEFA] rounded-2xl border border-[#DED8CF]/50 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.1)] p-6 scroll-mt-24"
              >
                {/* Title row */}
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="h-12 w-12 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: t.color + '15' }}
                  >
                    <Icon size={22} style={{ color: t.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-xl font-bold text-[#2C2C24]" style={{ fontFamily: "'Fraunces', Georgia, serif" }}>
                        {t.term}
                      </h2>
                      <span className="px-3 py-0.5 text-[10px] font-bold rounded-full text-white" style={{ backgroundColor: t.color }}>
                        {t.unit}
                      </span>
                    </div>
                    <p className="text-sm text-[#78786C] font-medium mt-0.5">{t.fullName}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-[#4A4A40] leading-relaxed mb-4">{t.description}</p>

                {/* How we use it */}
                <div className="bg-[#F0EBE5]/40 rounded-xl p-4 mb-4">
                  <p className="text-[10px] font-bold text-[#78786C] uppercase tracking-wider mb-1.5">How PulseGrid uses it</p>
                  <p className="text-xs text-[#4A4A40] leading-relaxed">{t.howWeUseIt}</p>
                </div>

                {/* Interpretation table */}
                {t.interpretation.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-bold text-[#78786C] uppercase tracking-wider mb-2">Interpretation Guide</p>
                    <div className="space-y-1.5">
                      {t.interpretation.map((row, i) => (
                        <div key={i} className="flex items-start gap-3 text-xs">
                          <span className="font-mono font-bold text-[#2C2C24] shrink-0 w-24">{row.range}</span>
                          <span className="text-[#4A4A40]">{row.meaning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Why it matters */}
                <div className="border-t border-[#DED8CF]/40 pt-3 mt-3">
                  <p className="text-[10px] font-bold text-[#78786C] uppercase tracking-wider mb-1">Why it matters</p>
                  <p className="text-xs text-[#4A4A40] leading-relaxed">{t.whyItMatters}</p>
                </div>

                {/* Reference */}
                {t.reference && (
                  <p className="text-[10px] text-[#78786C] mt-2 italic">Reference: {t.reference}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center py-10 mt-8">
          <button
            onClick={onBack}
            className="px-6 py-2.5 text-sm font-bold rounded-full bg-[#5D7052] text-white hover:bg-[#4A5A42] transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
