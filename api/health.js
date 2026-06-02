export default function handler(req, res) {
  if (process.env.RAPIDAPI_SECRET && req.headers['x-rapidapi-proxy-secret'] !== process.env.RAPIDAPI_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
