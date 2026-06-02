export default function handler(req, res) {
  if (process.env.RAPIDAPI_SECRET && req.headers['x-rapidapi-proxy-secret'] !== process.env.RAPIDAPI_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { json, indent = 2 } = req.body;
    if (!json) {
      return res.status(400).json({ error: 'Missing json field' });
    }

    const parsed = JSON.parse(json);
    const indentValue = indent === 0 ? 0 : parseInt(indent) || 2;
    const result = indentValue === 0 ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indentValue);
    
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
