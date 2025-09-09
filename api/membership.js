// Serverless function on Vercel: GET /api/memberships
// Proxies GymMaster and adds CORS so the browser can call it from Framer.

export default async function handler(req, res) {
  // --- CORS ---
  res.setHeader("Access-Control-Allow-Origin", "*"); // <-- restrict to your domain later if you want
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const GM_BASE =
      "https://idahofitnessfactory.gymmasteronline.com/portal/api/v1/memberships";

    const url = new URL(GM_BASE);
    url.searchParams.set("api_key", process.env.GM_API_KEY); // stored on Vercel
    if (req.query.token) url.searchParams.set("token", String(req.query.token));

    const gmRes = await fetch(url.toString());
    const body = await gmRes.text(); // pass through as-is
    res.status(gmRes.status)
       .setHeader("Content-Type", "application/json")
       .send(body);
  } catch (e) {
    res.status(500).json({ error: e?.message || "Proxy error" });
  }
}