import { jsonrepair } from 'jsonrepair'

export default function handler(req, res) {
  try {
    const { json } = req.body
    const result = jsonrepair(json)
    JSON.parse(result) // validate it actually worked
    res.status(200).json({ valid: true, result })
  } catch (e) {
    res.status(400).json({ valid: false, error: "Cannot repair: " + e.message })
  }
}
