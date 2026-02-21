// Vercel serverless: Protocol chat proxy. Set GEMINI_API_KEY in Vercel dashboard.

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

async function proxyToGemini(history, apiKey) {
  const contents = history.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
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

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
    return;
  }
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey.trim()) {
    res.status(503).json({ error: 'Protocol chat is not configured. Set GEMINI_API_KEY in the deployment environment.' });
    return;
  }
  const history = Array.isArray(req.body?.history) ? req.body.history : [];
  try {
    const reply = await proxyToGemini(history, apiKey);
    res.status(200).json({ reply });
  } catch (err) {
    res.status(502).json({ error: err.message || 'Upstream error' });
  }
}
