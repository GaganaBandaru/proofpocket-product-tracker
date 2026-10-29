# ProofPocket Frontend

React 19 + Vite 8 frontend for ProofPocket.

See the [root README](../README.md) for full setup and deployment instructions.

## Local Development

```bash
npm install
npm run dev
# Runs at http://localhost:5173
# /api requests are proxied to http://localhost:5001 automatically
```

## Build

```bash
npm run build
# Output in /dist — deploy this folder to Vercel
```

## Environment Variables

Copy `.env.example` to `.env.local`:
```
VITE_API_URL=https://your-render-backend.onrender.com
```

Leave `VITE_API_URL` empty in development — the Vite proxy handles it.
