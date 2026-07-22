export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  try {
    const { system, user } = req.body || {};
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 5000,
        system,
        messages: [{ role: "user", content: user }],
      }),
    });
    const data = await r.json();
    console.log("RESPUESTA CRUDA DE CLAUDE:", JSON.stringify(data));
    const text = (data.content || [])
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("\n");
    return res.status(200).json({ text });
  } catch (e) {
    console.error("ERROR EN EL PROXY:", e);
    return res.status(500).json({ error: "proxy_error", detalle: String(e) });
  }
}