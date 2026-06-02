import { jsonrepair } from 'jsonrepair'

const usage = new Map()

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  
  const key = req.headers['x-api-key'] || req.headers['x-forwarded-for'] || 'anon'
  const count = (usage.get(key) || 0) + 1
  usage.set(key, count)
  
  const isPaid = req.headers['x-api-key']?.startsWith('sk_paid_')
  if (!isPaid && count > 1000) {
    return res.status(429).json({ 
      error: 'Free limit: 1k calls/mo reached', 
      upgrade: 'https://buy.stripe.com/YOUR_LINK_HERE' 
    })
  }
  
  try {
    const { json } = req.body
    const result = jsonrepair(json)
    res.status(200).json({ result, calls: count })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
}
