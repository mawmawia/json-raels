import { useState } from 'react';
import Head from 'next/head';

export default function JSONTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [jsonPath, setJsonPath] = useState('$.store.book[*].author');
  const [tab, setTab] = useState('format');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callAPI = async (endpoint, body) => {
    setError(null);
    if (!body.json || body.json.trim() === '') {
      setError('Input is empty');
      return null;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `Error: ${res.status}`);
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const format = async (minify) => {
    const data = await callAPI('format', { json: input, minify });
    if (data) setOutput(data.result);
  };

  const repair = async () => {
    const data = await callAPI('repair', { json: input });
    if (data) {
      setInput(data.result);
      setOutput(data.result);
    }
  };

  const query = async () => {
    const data = await callAPI('query', { json: input, path: jsonPath });
    if (data) setOutput(JSON.stringify(data.result, null, 2));
  };

  return (
    <>
      <Head>
        <title>JSON Tools - Format, Fix, Query</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>
      <div className="min-h-screen bg-[#0d1117] text-gray-200 p-4">
        <h1 className="text-3xl font-bold">JSON Tools</h1>
        <p className="text-gray-400 mb-4">Format, fix, query. API is $12/mo for 100k calls.</p>

        {error && <div className="text-red-500 mb-4 font-bold">{error}</div>}

        <div className="flex gap-2 mb-4 border-b border-gray-800">
          {['format', 'repair', 'query'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-2 ${tab === t ? 'border-b-2 border-blue-500 text-white' : 'text-gray-500'}`}>
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
          <pre className="bg-[#161b22] p-3 rounded overflow-auto h-96 border border-gray-800 text-sm">
            {loading ? 'Processing...' : output}
          </pre>
        </div>

        {tab === 'format' && (
          <div className="flex gap-2 mt-4">
            <button onClick={() => format(false)} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Format</button>
            <button onClick={() => format(true)} className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600">Minify</button>
          </div>
        )}

        {tab === 'repair' && (
          <div className="mt-4">
            <button onClick={repair} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">Fix Broken JSON</button>
          </div>
        )}

        {tab === 'query' && (
          <div className="mt-4 flex gap-2">
            <input value={jsonPath} onChange={e => setJsonPath(e.target.value)}
              className="bg-[#161b22] p-2 rounded flex-1 border border-gray-800 font-mono text-sm" />
            <button onClick={query} className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700">Query</button>
          </div>
        )}
      </div>
    </>
  );
}
