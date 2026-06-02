import { JSONPath } from 'jsonpath-plus'

export default function handler(req, res) {
  try {
    const { json, path } = req.body
    const parsed = JSON.parse(json)
    const result = JSONPath({ path, json: parsed })
    res.status(200).json({ valid: true, result })
  } catch (e) {
    res.status(400).json({ valid: false, error: e.message })
  }
}
