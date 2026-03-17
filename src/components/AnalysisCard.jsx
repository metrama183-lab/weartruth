import { FiDroplet, FiSun, FiGlobe, FiClock, FiAlertCircle } from 'react-icons/fi'

const SYNTHETIC_MATERIALS = ['polyester', 'poliestere', 'nylon', 'acrylic', 'elastane', 'elastan', 'spandex', 'lycra', 'viscose', 'viscosa', 'modal', 'cupro']

function parseSyntheticPercent(composition) {
  const lower = composition.toLowerCase()
  let syntheticTotal = 0
  const regex = /(\d+(?:\.\d+)?)\s*%\s*([a-zA-ZÀ-ÿ\s]+)/g
  let match
  while ((match = regex.exec(lower)) !== null) {
    const percent = parseFloat(match[1])
    const material = match[2].trim()
    if (SYNTHETIC_MATERIALS.some(s => material.includes(s))) {
      syntheticTotal += percent
    }
  }
  return Math.min(syntheticTotal, 100)
}

function ScoreRing({ score }) {
  const pct = (score / 10) * 100
  const color = score >= 7 ? 'var(--accent-green)' : score >= 4 ? 'var(--accent-amber)' : 'var(--accent-red)'
  const verdict = score >= 7 ? 'Eccellente' : score >= 4 ? 'Migliorabile' : 'Critico'
  const radius = 40
  const circ = 2 * Math.PI * radius
  const dashOffset = circ * (1 - pct / 100)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', minWidth: '90px' }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="var(--border-subtle)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={radius} fill="none"
          stroke={color} strokeWidth="8"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          className="score-ring-fill"
        />
        <text x="50" y="50" textAnchor="middle" fill={color} fontSize="22" fontWeight="700" fontFamily="Inter" dominantBaseline="middle">{score}</text>
      </svg>
      <span style={{ color, fontSize: '13px', fontWeight: 700, letterSpacing: '0.03em' }}>{verdict}</span>
      <span style={{ color: 'var(--text-muted)', fontSize: '10px', letterSpacing: '0.03em' }}>Naturalezza</span>
    </div>
  )
}


const ROWS = [
  { key: 'microplastics', icon: <FiDroplet size={16} />, label: 'Microplastiche', color: 'var(--accent-red)' },
  { key: 'skinImpact',    icon: <FiSun size={16} />,     label: 'Impatto sulla pelle', color: 'var(--accent-amber)' },
  { key: 'envImpact',     icon: <FiGlobe size={16} />,   label: 'Impatto ambientale', color: 'var(--accent-blue)' },
  { key: 'durability',    icon: <FiClock size={16} />,   label: 'Durata media', color: 'var(--accent-green)' },
]

export default function AnalysisCard({ analysis, composition }) {
  const synth = parseSyntheticPercent(composition)
  const score = analysis.safetyScore || 5

  return (
    <div className="glass-card anim-fade-up" style={{ padding: '28px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className={`badge ${synth > 60 ? 'badge-red' : synth > 30 ? 'badge-amber' : 'badge-green'}`}>
              {synth > 60 ? '⚠️ Altamente sintetico' : synth > 30 ? '⚡ Misto sintetico' : '✅ Prevalentemente naturale'}
            </span>
            {synth > 0 && (
              <span className="badge badge-blue">{synth.toFixed(0)}% sintetico</span>
            )}
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            Analisi AI
          </h2>
          {analysis.summary && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', lineHeight: 1.6 }}>
              {analysis.summary}
            </p>
          )}
        </div>
        <ScoreRing score={score} />
      </div>

      <hr className="divider" />

      {/* Details grid */}
      <div style={{ display: 'grid', gap: '16px' }}>
        {ROWS.map(({ key, icon, label, color }, i) => (
          <div key={key} className={`anim-fade-up delay-${i + 1}`} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
            <div style={{
              flexShrink: 0, width: '36px', height: '36px',
              borderRadius: '8px', background: `${color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color,
            }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
                {label}
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {analysis[key] || '—'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
