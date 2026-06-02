export default function handler(req, res) {
  try {
    const { json, minify } = req.body
    const parsed = JSON.parse(json)
    const result = minify? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2)
    res.status(200).json({ valid: true, result, size: result.length })
  } catch (e) {
    res.status(400).json({
      valid: false,
      error: e.message,
      line: e.message.match(/position (\d+)/)?.[1] || null
    })
  }
}
