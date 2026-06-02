import { JSONPath } from 'jsonpath-plus';

export default function handler(req, res) {
  if (process.env.RAPIDAPI_SECRET && req.headers['x-rapidapi-proxy-secret'] !== process.env.RAPIDAPI_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { json, path } = req.body;
    if (!json || !path) {
      return res.status(400).json({ error: 'Missing json or path field' });
    }

    const parsed = JSON.parse(json);
    const result = JSONPath({ path, json: parsed });
    
    return res.status(200).json({ result });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
