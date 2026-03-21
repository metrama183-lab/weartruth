# 🌿 WearTruth

**Know the truth about what you wear.**

WearTruth analyzes the textile composition of your clothing label and returns a complete analysis on microplastics, skin impact, environmental footprint and durability — with 3 practical tips to make better choices.

> Project built for **YOUtopia 2026** — hackathon dedicated to building a better world.

---

### 📸 Screenshots

| Homepage | Results (100% polyester) |
|---|---|
| ![Homepage](docs/screenshot-results.png) | ![Results](docs/screenshot-homepage.png) |

---

## 💡 The Real Problem

You buy a T-shirt. The label says *"65% polyester, 30% viscose, 5% elastane"*. And then?

- **You don't know** it will release ~700,000 microplastics with every wash
- **You don't know** that polyester is derived from crude oil and doesn't biodegrade for 200+ years
- **You don't know** that certifications exist (OEKO-TEX, GOTS) that guarantee safer fabrics

The information exists, but it's scattered across scientific papers, ECHA reports, and specialist sites. **Nobody puts it together in a format you can understand in 2 seconds.**

WearTruth fixes this: paste the label, receive the truth.

---

## 🚀 How It Works

1. **Copy the label** from your garment (e.g. `65% polyester, 30% viscose, 5% elastane`)
2. **Paste it** in the text field
3. **Receive** an AI analysis with a naturalness score (1–10), details on microplastics/skin/environment, and 3 structural tips

## 🏗️ Architecture

```
Frontend (React + Vite)
    │
    ├── compositionCache.json  ← 15 curated compositions (instant hit)
    │
    └── /api/analyze  ← Vercel Serverless Function (proxy)
            │
            └── Groq API (llama-3.1-8b-instant, JSON mode)
```

### Key Technical Decisions

| Decision | Rationale |
|---|---|
| **Serverless proxy** | API key never exposed in the client-side bundle |
| **`response_format: json_object`** | Groq guarantees valid JSON server-side — zero parsing failures |
| **Curated cache** | The 15 most common compositions return manually verified data from ECHA and OEKO-TEX, no API call needed |
| **`llama-3.1-8b-instant`** | Sub-1s latency, ~6000 RPM free tier, no Vercel Hobby timeout risk (10s) |
| **Structural tips** | Zero product links = zero greenwashing, zero gifted traffic, zero broken links |
| **Prompt injection guard** | Non-textile inputs return `safetyScore: 0` with an error message |
| **AbortController 8s** | Client-side timeout for slow connections — clear error instead of frozen screen |
| **Input sanitization** | Strip HTML + 500 character limit before sending to server |

## 🛡️ Security

- ✅ API key server-side only (`process.env.GROQ_API_KEY`)
- ✅ CORS configured in the serverless handler
- ✅ Input sanitized (strip HTML, character limit)
- ✅ Prompt injection guard in system prompt
- ✅ `.env` in `.gitignore`

## 📦 Tech Stack

- **Frontend**: React 18, Vite 6, Vanilla CSS
- **AI**: Groq API (`llama-3.1-8b-instant`) with native JSON mode
- **Backend**: Vercel Serverless Functions (Node.js)
- **Design**: Dark mode, glassmorphism, Inter font, CSS animations
- **Bundle**: ~184kB JS, ~6kB CSS (zero heavy UI frameworks)

## 🏃 Quick Start

```bash
# 1. Clone
git clone https://github.com/metrama183-lab/weartruth.git
cd weartruth

# 2. Install dependencies
npm install

# 3. Configure the API key
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# 4. Install Vercel CLI (for local proxy)
npm i -g vercel

# 5. Start locally
vercel dev
```

## 📊 Performance

| Metric | Value |
|---|---|
| Cache hit (common composition) | **<10ms** |
| Cache miss (Groq API call) | **~1–2s** |
| Build time | **~600ms** |
| JS bundle | **184kB** (gzip: 59kB) |
| CSS bundle | **6kB** (gzip: 2kB) |
| Total modules | **37** |

## 📄 License

MIT — built for YOUtopia 2026.
