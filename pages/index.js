import { useState } from 'react'

export default function JSONTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [jsonPath, setJsonPath] = useState('$.store.book[*].author')
  const [tab][setTab] = useState('format')

  const callAPI = async (endpoint, body) => {
    const res = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })
    return res.json()
  }

  const format = async (minify) => {
    const data = await callAPI('format', { json: input, minify })
    setOutput(data.valid? data.result : `Error: ${data.error}`)
  }

  const repair = async () => {
    const data = await callAPI('repair', { json: input })
    setInput(data.result)
    setOutput(data.result)
  }

  const query = async () => {
    const data = await callAPI('query', { json: input, path: jsonPath })
    setOutput(JSON.stringify(data.result, null, 2))
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200 p-4">
      <h1 className="text-3xl font-bold">JSON Tools</h1>
      <p className="text-gray-400 mb-4">Format, fix, query. API is $12/mo for 100k calls.</p>

      <div className="flex gap-2 mb-4 border-b border-gray-800">
        {['format', 'repair', 'query'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-2 ${tab===t? 'border-b-2 border-blue-500 text-white' : 'text-gray-500'}`}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          className="bg-[#161b22] w-full h-96 p-3 rounded font-mono text-sm border border-gray-800"
          placeholder='{"broken": json, trailing:,}'
        />
        <pre className="bg-[#161b22] p-3 rounded overflow-auto h-96 border border-gray-800 text-sm">{output}</pre>
      </div>

      {tab === 'format' && (
        <div className="flex gap-2 mt-4">
          <button onClick={() => format(false)} className="bg-blue-600 px-4 py-2 rounded">Format</button>
          <button onClick={() => format(true)} className="bg-gray-700 px-4 py-2 rounded">Minify</button>
        </div>
      )}

      {tab === 'repair' && (
        <div className="mt-4">
          <button onClick={repair} className="bg-green-600 px-4 py-2 rounded">Fix Broken JSON</button>
          <p className="text-xs text-gray-500 mt-1">Fixes missing quotes, trailing commas, single quotes</p>
        </div>
      )}

      {tab === 'query' && (
        <div className="mt-4 flex gap-2">
          <input value={jsonPath} onChange={e => setJsonPath(e.target.value)}
            className="bg-[#161b22] p-2 rounded flex-1 border border-gray-800 font-mono text-sm"
            placeholder="$.users[?(@.age > 21)]" />
          <button onClick={query} className="bg-purple-600 px-4 py-2 rounded">Query</button>
        </div>
      )}

      <div className="mt-8 text-xs text-gray-500">
        <p>API: POST json.raels.dev/api/format | /api/repair | /api/query</p>
        <p>$12/mo = 100k calls. Free: 1k/mo. <a href="/pricing" className="text-blue-400">Upgrade</a></p>
      </div>
    </div>
  )
}
