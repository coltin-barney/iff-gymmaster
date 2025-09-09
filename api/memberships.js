const UPSTREAM = "https://idahofitnessfactory.gymmasteronline.com/portal/api/v1/memberships";

// TEMP: open CORS for testing. Lock this down after you confirm it works.
const setCors = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
};

export default async function handler(req, res) {
  try {
    setCors(req, res);
    if (req.method === "OPTIONS") return res.status(204).end();

    const apiKey = process.env.GYMMASTER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "API key missing on server" });

    const upstream = await fetch(`${UPSTREAM}?api_key=${encodeURIComponent(apiKey)}`, {
      method: "GET",
      headers: { "User-Agent": "IFF-FramerProxy/1.0" },
    });

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=60");
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (e) {
    return res.status(500).json({ error: "Proxy error", detail: e?.message || String(e) });
  }
}test
