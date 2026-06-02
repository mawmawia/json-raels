export default async function handler(req, res) {
  if (process.env.RAPIDAPI_SECRET && req.headers['x-rapidapi-proxy-secret'] !== process.env.RAPIDAPI_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { json } = req.body;
    if (!json) return res.status(400).json({ error: 'Missing json field' });

    const jsonrepair = await import('jsonrepair');
    const repaired = jsonrepair.jsonrepair(json);
    JSON.parse(repaired);
    
    return res.status(200).json({ result: repaired });
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}
