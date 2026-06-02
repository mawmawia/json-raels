import { useState } from 'react'

export default function Home() {
  const [input, setInput] = useState(`{name: 'Rael', active: yes, skills: ['ship',],}`)
  const [output, setOutput] = useState('')
  const [tab, setTab] = useState('format')
  const [path, setPath] = useState('$')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const callApi = async (endpoint, body) => {
    setLoading(true)
    setError('')
    setOutput('')
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      
      if (!res.ok) {
        setError(data.error || `Error: ${res.status}`)
        return
      }
      
      if (data.error) {
        setError(data.error)
      } else {
        setOutput(data.result || JSON.stringify(data, null, 2))
      }
    } catch (e) {
      setError(`Network error: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleFormat = () => callApi('format', { json: input, minify: false })
  const handleMinify = () => callApi('format', { json: input, minify: true })
  const handleRepair = () => callApi('repair', { json: input })
  const handleQuery = () => callApi('query', { json: input, path })

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d1117',
      color: '#c9d1d9',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '8px', color: '#f0f6fc' }}>JSON Tools API</h1>
        <p style={{ margin: '0 0 20px 0', color: '#8b949e', fontSize: '14px' }}>
          Format, fix, query. API is $12/mo for 100k calls.
        </p>
        
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #30363d' }}>
          {['format', 'repair', 'query'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '8px 16px',
                background: tab === t ? '#1f6feb' : 'transparent',
                border: 'none',
                borderBottom: tab === t ? '2px solid #1f6feb' : '2px solid transparent',
                color: tab === t ? '#fff' : '#8b949e',
                cursor: 'pointer',
                textTransform: 'uppercase',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON here..."
            style={{
              width: '100%',
              height: '400px',
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '6px',
              color: '#c9d1d9',
              padding: '12px',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'none'
            }}
          />
          <textarea
            value={error || output}
            readOnly
            placeholder="Result..."
            style={{
              width: '100%',
              height: '400px',
              background: '#161b22',
              border: `1px solid ${error ? '#f85149' : '#30363d'}`,
              borderRadius: '6px',
              color: error ? '#f85149' : '#c9d1d9',
              padding: '12px',
              fontFamily: 'monospace',
              fontSize: '14px',
              resize: 'none'
            }}
          />
        </div>

        {tab === 'query' && (
          <input
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="JSONPath: $.store.book[*].author"
            style={{
              width: '100%',
              background: '#161b22',
              border: '1px solid #30363d',
              borderRadius: '6px',
              color: '#c9d1d9',
              padding: '8px 12px',
              fontFamily: 'monospace',
              fontSize: '14px',
              marginBottom: '16px'
            }}
          />
        )}

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {tab === 'format' && (
            <>
              <button onClick={handleFormat} disabled={loading} style={btnStyle}>
                {loading ? 'Working...' : 'Format'}
              </button>
              <button onClick={handleMinify} disabled={loading} style={btnStyle}>
                {loading ? 'Working...' : 'Minify'}
              </button>
            </>
          )}
          {tab === 'repair' && (
            <button onClick={handleRepair} disabled={loading} style={btnStyle}>
              {loading ? 'Fixing...' : 'Fix Broken JSON'}
            </button>
          )}
          {tab === 'query' && (
            <button onClick={handleQuery} disabled={loading} style={btnStyle}>
              {loading ? 'Querying...' : 'Run JSONPath'}
            </button>
          )}
        </div>

        <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #30363d', fontSize: '14px', color: '#8b949e' }}>
          <p style={{ margin: '4px 0' }}>API: POST json.raels.dev/api/format | /api/repair | /api/query</p>
          <p style={{ margin: '4px 0' }}>
            $12/mo = 100k calls. Free: 1k/mo. 
            <a href="https://buy.stripe.com/YOUR_LINK_HERE" style={{ color: '#58a6ff', marginLeft: '8px' }}>Upgrade</a>
          </p>
        </div>
      </div>
    </div>
  )
}

const btnStyle = {
  padding: '8px 16px',
  background: '#238636',
  border: '1px solid #2ea043',
  borderRadius: '6px',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600'
}
