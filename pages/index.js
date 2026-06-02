import { useState } from 'react'

export default function JSONTool() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [jsonPath, setJsonPath] = useState('$.store.book[*].author')
  const [tab, setTab] = useState('format')

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
    setOutput(data.valid ? data.result : `Error: ${data.error}`)
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

  const btnStyle = (active) => ({
    padding: '8px 12px',
    border: 'none',
    borderBottom: active ? '2px solid #3b82f6' : '2px solid transparent',
    background: 'none',
    color: active ? '#ffffff' : '#6b7280',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500
  })

  const actionBtn = (color) => ({
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    background: color,
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500
  })

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0d1117', 
      color: '#e5e7eb', 
      padding: '16px', 
      fontFamily: 'ui-sans-serif, system-ui, sans-serif' 
    }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 8px 0' }}>JSON Tools</h1>
      <p style={{ color: '#9ca3af', marginBottom: '16px', fontSize: '14px' }}>
        Format, fix, query. API is $12/mo for 100k calls.
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #1f2937' }}>
        {['format', 'repair', 'query'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={btnStyle(tab === t)}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder='{"broken": json, trailing:,}'
          style={{ 
            backgroundColor: '#161b22', 
            width: '100%', 
            height: '384px', 
            padding: '12px', 
            borderRadius: '6px', 
            border: '1px solid #30363d', 
            color: '#e5e7eb',
            fontFamily: 'ui-monospace, monospace',
            fontSize: '13px',
            resize: 'none'
          }}
        />
        <pre style={{ 
          backgroundColor: '#161b22', 
          padding: '12px', 
          borderRadius: '6px', 
          overflow: 'auto', 
          height: '384px', 
          border: '1px solid #30363d',
          margin: 0,
          fontFamily: 'ui-monospace, monospace',
          fontSize: '13px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all'
        }}>{output}</pre>
      </div>

      {tab === 'format' && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => format(false)} style={actionBtn('#2563eb')}>Format</button>
          <button onClick={() => format(true)} style={actionBtn('#4b5563')}>Minify</button>
        </div>
      )}

      {tab === 'repair' && (
        <div>
          <button onClick={repair} style={actionBtn('#16a34a')}>Fix Broken JSON</button>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Fixes missing quotes, trailing commas, single quotes
          </p>
        </div>
      )}

      {tab === 'query' && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            value={jsonPath} 
            onChange={e => setJsonPath(e.target.value)}
            placeholder="$.users[?(@.age > 21)]"
            style={{ 
              backgroundColor: '#161b22', 
              padding: '8px 12px', 
              borderRadius: '6px', 
              border: '1px solid #30363d',
              color: '#e5e7eb',
              flex: 1,
              fontFamily: 'ui-monospace, monospace',
              fontSize: '13px'
            }}
          />
          <button onClick={query} style={actionBtn('#9333ea')}>Query</button>
        </div>
      )}

      <div style={{ marginTop: '32px', fontSize: '12px', color: '#6b7280' }}>
        <p>API: POST json.raels.dev/api/format | /api/repair | /api/query</p>
        <p>$12/mo = 100k calls. Free: 1k/mo. <a href="/pricing" style={{ color: '#3b82f6' }}>Upgrade</a></p>
      </div>
    </div>
  )
                 }
