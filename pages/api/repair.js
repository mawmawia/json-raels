export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' })
  }

  try {
    // Get json from body
    const { json } = req.body || {}
    
    console.log('REPAIR API: Received json:', json)
    
    if (!json || typeof json !== 'string') {
      return res.status(400).json({ error: 'Missing or invalid json field' })
    }

    // Import jsonrepair
    const { jsonrepair } = await import('jsonrepair')
    
    // Repair the JSON
    const repaired = jsonrepair(json)
    console.log('REPAIR API: Repaired result:', repaired)
    
    // Validate it parses
    JSON.parse(repaired)
    
    // Return with key 'result' - frontend expects this exact key
    return res.status(200).json({ result: repaired })
    
  } catch (e) {
    console.error('REPAIR API ERROR:', e.message)
    return res.status(400).json({ 
      error: `Repair failed: ${e.message}` 
    })
  }
}
