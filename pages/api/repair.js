import { jsonrepair } from 'jsonrepair'

const usage = new Map()

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  
  try {
    const ip = req.headers['x-forwarded-for'] || 'unknown'
    const key = req.headers['x-api-key'] || ip
    const count = (usage.get(key) || 0) + 1
    usage.set(key, count)
    
    const isPaid = key.startsWith('sk_paid_')
    if (!isPaid && count > 1000) {
      return res.status(429).json({ 
        error: 'Free limit: 1k calls/mo reached',
        upgrade: 'https://buy.stripe.com/YOUR_LINK_HERE'
      })
    }
    
    let { json } = req.body
    if (!json) return res.status(400).json({ error: 'Missing json field' })
    
    // Critical fix: escape newlines and other control chars
    json = json.replace(/\n/g, '\\n').replace(/\r/g, '\\r').replace(/\t/g, '\\t')
    
    const repaired = jsonrepair(json)
    const parsed = JSON.parse(repaired)
    
    res.json({ 
      result: JSON.stringify(parsed, null, 2),
      calls: count
    })
    
  } catch (e) {
    res.status(400).json({ 
      error: `Repair failed: ${e.message}`
    })
  }
}
