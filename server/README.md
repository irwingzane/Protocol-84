# Protocol chat API (backend proxy)

This server keeps your Gemini API key **off the browser** so the public never sees it. The frontend calls this server; the server calls Google Gemini.

## Setup

1. Get a free API key: [Google AI Studio](https://aistudio.google.com/apikey) (use your Google account).
2. In this folder, copy `.env.example` to `.env` and set your key:
   - Windows: `copy .env.example .env`
   - macOS/Linux: `cp .env.example .env`
   Edit `.env` and set `GEMINI_API_KEY=your_key_here`. The `.env` file is gitignored so the key is never committed.
3. Optional: run `npm install` so the server can load `.env` automatically. Otherwise set `GEMINI_API_KEY` in your shell when starting the server.

## Run locally

From the `server` folder:

```bash
npm install   # not required – no dependencies
node server.js
```

Or with the key in the environment:

```bash
# Windows (PowerShell)
$env:GEMINI_API_KEY="your_key"; node server.js

# macOS / Linux
GEMINI_API_KEY=your_key node server.js
```

Then open the app from the same origin, e.g. **http://localhost:3000/app.html**. The page will call `http://localhost:3000/api/protocol-chat` and chat will work.

## Deploying for the public

- **Option A – Same origin:** Deploy this Node server and serve your static site from it (the server already serves files from the parent folder). Set `GEMINI_API_KEY` in your host’s environment (e.g. Railway, Render, Fly.io). Leave `PROTOCOL_CHAT_API_URL` empty in `app.js`.
- **Option B – Static site elsewhere:** Deploy this server to a URL (e.g. `https://api.yoursite.com`). In `app.js` set `PROTOCOL_CHAT_API_URL = 'https://api.yoursite.com'`. Enable CORS on the server if needed (the server sets `Access-Control-Allow-Origin` from the request `Origin` header).
- **Option C – Vercel (Live Server / protocol84.com):** Deploy the **project root** (which contains the `api/` folder) to [Vercel](https://vercel.com). In the Vercel project, add **Environment Variable** `GEMINI_API_KEY`. After deploy, copy your app URL (e.g. `https://your-project.vercel.app`). In `app.js` set `PROTOCOL_CHAT_API_URL = 'https://your-project.vercel.app'`. Then Protocol chat works from Live Server and from www.protocol84.com.

## Security

- Never put `GEMINI_API_KEY` in `app.js` or any file that is sent to the browser.
- Regenerate your key at [Google AI Studio](https://aistudio.google.com/apikey) if it was ever committed or exposed.
