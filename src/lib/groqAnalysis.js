// WearTruth — AI textile analysis (client-side module)
// ✅ API key lives ONLY on the server (api/analyze.js)
// ✅ Frontend calls /api/analyze — never Groq directly
// ✅ Cache checked first — zero API call for known compositions
// ✅ 12s client-side timeout to prevent hanging on slow connections

import cache from '../data/compositionCache.json'

// ── Sanitize & normalize ────────────────────────────────────────────────────

function sanitize(str) {
  return str
    .replace(/<[^>]*>/g, '')      // strip HTML tags
    .replace(/[^\w\s%,.'éèêëàâäùûüôöîïçñ€-]/gi, '') // keep only safe chars
    .slice(0, 500)                 // hard limit 500 chars
    .trim()
}

function normalizeComposition(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/,\s*/g, ', ')
    .replace(/%\s+/g, '% ')
    .trim()
}

// ── Cache lookup ────────────────────────────────────────────────────────────

export function findInCache(composition) {
  const normalized = normalizeComposition(composition)
  for (const entry of cache.entries) {
    const candidates = [entry.key, ...(entry.aliases || [])]
    if (candidates.some(c => normalizeComposition(c) === normalized)) {
      return { ...entry, fromCache: true }
    }
  }
  return null
}

// ── API proxy call with timeout ─────────────────────────────────────────────

const API_TIMEOUT_MS = 12000 // 12 seconds — generous but catches hangs

export async function analyzeComposition(rawComposition) {
  const composition = sanitize(rawComposition)
  if (!composition) throw new Error('Composizione non valida.')

  // 1️⃣ Cache hit → instant, no network
  const cached = findInCache(composition)
  if (cached) {
    console.log('[WearTruth] Cache hit — skipping API call')
    return cached
  }

  // 2️⃣ Cache miss → call our serverless proxy (key stays server-side)
  console.log('[WearTruth] Cache miss — calling /api/analyze')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS)

  try {
    const res = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ composition }),
      signal: controller.signal,
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err?.error || `Errore server: ${res.status}`)
    }

    return res.json()
  } catch (err) {
    clearTimeout(timeout)
    if (err.name === 'AbortError') {
      throw new Error('L\'analisi sta impiegando troppo tempo. Riprova tra qualche secondo.')
    }
    throw err
  }
}
