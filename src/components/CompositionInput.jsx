import { useState } from 'react'
import { FiZap } from 'react-icons/fi'

const EXAMPLES = [
  '65% polyester, 30% viscose, 5% elastane',
  '100% polyester',
  '80% cotton, 20% polyester',
  '100% organic cotton',
  '50% linen, 50% cotton',
  '95% cotton, 5% elastane',
]

export default function CompositionInput({ onAnalyze, isLoading }) {
  const [composition, setComposition] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!composition.trim()) return
    onAnalyze({ composition: composition.trim() })
  }

  const useExample = (ex) => setComposition(ex)

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Composition field */}
      <div>
        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Composizione tessile
        </label>
        <textarea
          className="composition-input"
          rows={3}
          value={composition}
          onChange={(e) => setComposition(e.target.value)}
          placeholder={'Copia l\'etichetta qui — es: "65% polyester, 30% viscose, 5% elastane"'}
          disabled={isLoading}
          aria-label="Inserisci la composizione tessile"
          id="composition-textarea"
        />
        {/* Example chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => useExample(ex)}
              className="example-chip"
            >
              {ex.length > 30 ? ex.slice(0, 28) + '…' : ex}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary"
        disabled={isLoading || !composition.trim()}
        style={{ width: '100%', padding: '16px' }}
        id="analyze-btn"
      >
        {isLoading ? (
          <>
            <div className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px' }} />
            Analisi in corso…
          </>
        ) : (
          <>
            <FiZap size={18} />
            Analizza l&apos;etichetta
          </>
        )}
      </button>
    </form>
  )
}
