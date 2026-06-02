import { jsonrepair } from 'jsonrepair';

export default function handler(req, res) {
  if (process.env.RAPIDAPI_SECRET && req.headers['x-rapidapi-proxy-secret'] !== process.env.RAPIDAPI_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { json } = req.body;
    if (!json) {
      return res.status(400).json({ error: 'Missing json field' });
    }

    const repaired = jsonrepair(json);
    JSON.parse(repaired);
    
    return res.status(200).json({ result: repaired });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
