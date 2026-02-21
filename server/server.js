// Load .env if dotenv is installed (npm install dotenv)
try { require('dotenv').config(); } catch (_) {}

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const PROTOCOL_SYSTEM_PROMPT = `You are Protocol, the AI assistant for Protocol84 — an employee performance and resilience platform. Answer using only the following information about the website and programme. Be concise and helpful.

**Company & programme**
- Protocol84: science-based, structured 12-week programme delivered as an employee benefit.
- Includes weekly guided training sessions (new exercises each week), on-demand training (strength, conditioning, mobility, splits), and an integrated AI tool for fitness questions.
- Content: 12-week journey with week-by-week pathway; pre-recorded workouts; gym programmes; goal-based splits; monthly science updates; discipline & habit system; stress management; productivity modules; nutrition guidance; mental resilience training.

**Content library (by section)**
- Library: 20-minute desk reset, Pre-meeting reset, 90-minute execution block, Designing sustainable routines, Managing setbacks under pressure.
- Training: Full body strength circuit, Boxing conditioning basics, Morning mobility flow, Lower body & core, Push Pull Legs, Upper and lower, Bulking, Cutting.
- Mental health: 5-minute stress reset (with box-breathing tool), Daily mindfulness, Resilience building blocks, Habit stacking.
- Newsletter: Zane's Newsletter (monthly science-based updates), Past issues.
- Nutrition: Fuel for high-output days, Post-training nutrition, Meal planning basics, Fluid & electrolytes, Supplement guide, Cutting meals, Bulking meals (PDFs in app).

**Pricing**
- Personal: £18.99/month, for individuals.
- Small: up to 25 employees, £10.99/employee/month.
- Medium: up to 100 employees, £6.99/employee/month (most popular).
- Enterprise: 100+ employees, custom pricing.

**Team & contact**
- Team: Ethan Kemp (cardiovascular health, Kentucky State Commonwealth University football); Zane Irwing (founder, former boxer, hypertrophic bodybuilder, works at Amazon).
- Contact: irwingzane@gmail.com, +44 7306 142153. Demo booking via contact form on website.

**App**
- Employees get a dashboard: overview, 12-week journey, content library (training, mental health, newsletter, nutrition), This Week's Session (weekly guided workout).`;

async function proxyToGemini(history) {
  const contents = history.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY,
    },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: PROTOCOL_SYSTEM_PROMPT }] },
      contents,
      generationConfig: { temperature: 0.6, maxOutputTokens: 1024 },
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = data.error?.message || data.error?.code || String(res.status);
    throw new Error(err);
  }
  const candidate = data.candidates && data.candidates[0];
  const part = candidate && candidate.content && candidate.content.parts && candidate.content.parts[0];
  return (part && part.text) || 'No response.';
}

const MIME = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const pathname = (req.url || '').split('?')[0];
  if (pathname === '/api/protocol-chat') {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json', 'Allow': 'POST' });
      res.end(JSON.stringify({ error: 'Method Not Allowed. Use POST. Open the app from this server: http://localhost:' + PORT + '/app.html' }));
      return;
    }
    if (!GEMINI_API_KEY || !GEMINI_API_KEY.trim()) {
      res.writeHead(503, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Protocol chat is not configured. Set GEMINI_API_KEY on the server.' }));
      return;
    }
    let body = '';
    for await (const chunk of req) body += chunk;
    let history;
    try {
      const parsed = JSON.parse(body);
      history = Array.isArray(parsed.history) ? parsed.history : [];
    } catch {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Invalid JSON or missing history.' }));
      return;
    }
    try {
      const reply = await proxyToGemini(history);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ reply }));
    } catch (err) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: err.message || 'Upstream error' }));
    }
    return;
  }

  let url = req.url === '/' ? '/app.html' : req.url;
  if (url.startsWith('/api/')) {
    res.writeHead(404);
    res.end();
    return;
  }
  const root = path.resolve(path.join(__dirname, '..'));
  let pathname = url.split('?')[0];
  try {
    pathname = decodeURIComponent(pathname);
  } catch (_) {
    pathname = url.split('?')[0];
  }
  const file = path.resolve(path.join(root, pathname.replace(/^\/+/, '')));
  if (!file.startsWith(root)) {
    res.writeHead(403);
    res.end();
    return;
  }
  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(err.code === 'ENOENT' ? 404 : 500);
      res.end();
      return;
    }
    const ext = path.extname(file);
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('Server at http://localhost:' + PORT);
  if (!GEMINI_API_KEY || !GEMINI_API_KEY.trim()) {
    console.warn('GEMINI_API_KEY is not set. Protocol chat will return 503 until you set it.');
  }
});
