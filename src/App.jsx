import { useState, useCallback, useRef } from 'react'
import CompositionInput from './components/CompositionInput'
import AnalysisCard from './components/AnalysisCard'
import TipsSection from './components/TipsSection'
import { analyzeComposition } from './lib/groqAnalysis'
import { FiDroplet, FiRefreshCcw, FiAlertTriangle, FiShare2, FiCheck } from 'react-icons/fi'


export default function App() {
  const [state, setState] = useState('idle') // idle | loading | results | error
  const [analysis, setAnalysis] = useState(null)
  const [lastInput, setLastInput] = useState(null)
  const [error, setError] = useState('')
  const [shared, setShared] = useState(false)
  const resultsRef = useRef(null)

  const handleAnalyze = useCallback(async ({ composition }) => {
    setState('loading')
    setError('')
    setLastInput({ composition })

    try {
      const result = await analyzeComposition(composition)
      setAnalysis(result)
      setState('results')
      // Smooth scroll to results after render
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err) {
      setError(err.message || 'Errore sconosciuto')
      setState('error')
    }
  }, [])

  const handleRetry = () => {
    if (lastInput) handleAnalyze(lastInput)
  }

  const handleReset = () => {
    setState('idle')
    setAnalysis(null)
    setError('')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ===== HEADER ===== */}
      <header style={{
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10,10,10,0.85)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={handleReset}>
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #4ade80, #86efac)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <FiDroplet size={18} color="#052e16" strokeWidth={2.5} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
            Wear<span style={{ color: 'var(--accent-green)' }}>Truth</span>
          </span>
        </div>
        {state === 'results' && (
          <button
            onClick={handleReset}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              fontSize: '13px', fontWeight: 600,
              cursor: 'pointer',
              transition: 'border-color 0.2s, color 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent-green)'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
          >
            <FiRefreshCcw size={14} />
            Nuova analisi
          </button>
        )}
      </header>

      <main style={{ flex: 1, maxWidth: '860px', width: '100%', margin: '0 auto', padding: '0 20px 60px' }}>

        {/* ===== HERO (idle/loading/error) ===== */}
        {state !== 'results' && (
          <div className="anim-fade-up" style={{ textAlign: 'center', padding: '60px 0 48px' }}>
            <div className="badge badge-green" style={{ marginBottom: '20px', fontSize: '13px' }}>
              🌿 Analisi AI gratuita · Zero pubblicità
            </div>
            <h1 style={{
              fontSize: 'clamp(32px, 6vw, 58px)',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '18px',
            }}>
              Conosci la verità su<br />
              <span style={{
                background: 'linear-gradient(90deg, #4ade80, #86efac, #fbbf24)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                quello che indossi
              </span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '17px', maxWidth: '540px', margin: '0 auto 48px', lineHeight: 1.7 }}>
              Inserisci la composizione dell&apos;etichetta. L&apos;AI analizza microplastiche,
              impatto sulla pelle e sull&apos;ambiente — e ti dà 3 consigli concreti per fare meglio.
            </p>

            {/* Input card */}
            <div className="glass-card" style={{ padding: '32px', textAlign: 'left' }}>
              <CompositionInput onAnalyze={handleAnalyze} isLoading={state === 'loading'} />
            </div>

            {/* Loading shimmer */}
            {state === 'loading' && (
              <div className="anim-fade-in" style={{ marginTop: '24px' }}>
                <div className="shimmer-block" style={{ height: '200px', borderRadius: 'var(--radius-lg)' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
                  <div className="shimmer-block" style={{ height: '80px', borderRadius: 'var(--radius-md)' }} />
                  <div className="shimmer-block" style={{ height: '80px', borderRadius: 'var(--radius-md)' }} />
                  <div className="shimmer-block" style={{ height: '80px', borderRadius: 'var(--radius-md)' }} />
                </div>
              </div>
            )}

            {/* Error state */}
            {state === 'error' && (
              <div className="glass-card anim-fade-in" style={{
                marginTop: '20px', padding: '20px',
                border: '1px solid rgba(248,113,113,0.3)',
                textAlign: 'left',
              }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <FiAlertTriangle size={20} color="var(--accent-red)" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-red)', marginBottom: '4px' }}>Errore durante l&apos;analisi</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{error}</div>
                  </div>
                  <button
                    onClick={handleRetry}
                    style={{
                      flexShrink: 0,
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px',
                      background: 'rgba(248,113,113,0.1)',
                      border: '1px solid rgba(248,113,113,0.3)',
                      borderRadius: '8px',
                      color: 'var(--accent-red)',
                      fontSize: '13px', fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <FiRefreshCcw size={12} />
                    Riprova
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== RESULTS ===== */}
        {state === 'results' && analysis && (
          <div ref={resultsRef} style={{ paddingTop: '40px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {/* Input recap */}
            <div className="anim-fade-in" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Analisi per:</span>
              <span style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-subtle)',
                borderRadius: '6px', padding: '4px 12px',
                fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'monospace',
              }}>
                {lastInput?.composition}
              </span>
              {analysis.fromCache && (
                <span className="badge badge-green" style={{ fontSize: '11px' }}>📚 Curato da fonti scientifiche</span>
              )}
            </div>

            {/* AI Analysis */}
            <AnalysisCard analysis={analysis} composition={lastInput?.composition || ''} />

            {/* Structural Tips */}
            <TipsSection tips={analysis?.tips} />

            {/* Share button */}
            <div className="anim-fade-up delay-4" style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                onClick={async () => {
                  const score = analysis.safetyScore || 0
                  const verdict = score >= 7 ? 'Eccellente' : score >= 4 ? 'Migliorabile' : 'Critico'
                  const text = `🌿 Ho analizzato un capo in ${lastInput?.composition}\n\nNaturalezza: ${score}/10 (${verdict})\n${analysis.summary}\n\nScopri cosa indossi → weartruth.vercel.app`

                  if (navigator.share) {
                    await navigator.share({ text }).catch(() => {})
                  } else {
                    await navigator.clipboard.writeText(text)
                    setShared(true)
                    setTimeout(() => setShared(false), 2000)
                  }
                }}
                className="btn-share"
              >
                {shared ? <FiCheck size={16} /> : <FiShare2 size={16} />}
                {shared ? 'Copiato!' : 'Condividi risultato'}
              </button>
            </div>

            {/* Footer note */}
            <p className="anim-fade-up" style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '4px' }}>
              {analysis.fromCache
                ? 'Composizione analizzata manualmente su fonti ECHA, OEKO-TEX e letteratura scientifica.'
                : 'Analisi generata dall\u2019AI su questa composizione specifica. I dati comuni sono verificati manualmente.'}
            </p>
          </div>
        )}
      </main>

      {/* ===== FOOTER ===== */}
      <footer style={{
        textAlign: 'center',
        padding: '20px',
        fontSize: '12px',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        WearTruth — Sapere cosa indossi è un diritto • YOUtopia 2026
      </footer>
    </div>
  )
}
