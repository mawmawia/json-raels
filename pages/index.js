import { useState } from 'react';
import Head from 'next/head';

export default function JSONTool() {
  const [input, setInput] = useState(`{name: 'Rael', active: yes, items: [1,,3], tags: [dev,]}`);
  const [output, setOutput] = useState('');
  const [jsonPath, setJsonPath] = useState('$.store.book[*].author');
  const [tab, setTab] = useState('repair');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callAPI = async (endpoint, body) => {
    setError(null);
    if (!body.json || body.json.trim() === '') {
      setError('Input is empty');
      return null;
    }

    setLoading(true);
    setOutput('');
    try {
      console.log("FETCHING:", `/api/${endpoint}`, body);
      const res = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      console.log("RAW RESPONSE STATUS:", res.status, res.statusText);
      const data = await res.json();
      console.log("PARSED JSON:", data);
      
      if (!res.ok) {
        throw new Error(data.error || `Error: ${res.status}`);
      }
      
      return data;
    } catch (err) {
      console.error("callAPI CATCH:", err.message);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const format = async (minify) => {
    console.log("Format initiated, minify:", minify);
    const data = await callAPI('format', { json: input, minify });
    
    console.log("Format API returned:", data);
    
    if (data && data.result) {
      setOutput(data.result);
    } else {
      setOutput("Error: No result returned from API");
    }
  };

  const repair = async () => {
    console.log("1. Repair button clicked. Current input:", input);
    
    const data = await callAPI('repair', { json: input });
    
    console.log("2. API response received:", data);
    console.log("3. data.result exists?", !!data?.result);
    
    if (data && data.result) {
      console.log("4. Setting output to:", data.result);
      setOutput(data.result);
    } else if (data && data.error) {
      console.log("4. API returned error:", data.error);
      setOutput(`API Error: ${data.error}`);
    } else {
      console.log("4. No data.result. Full response:", data);
      setOutput("Error: API returned nothing. Check console.");
    }
  };

  const query = async () => {
    console.log("Query initiated. Path:", jsonPath);
    const data = await callAPI('query', { json: input, path: jsonPath });
    
    console.log("Query API returned:", data);
    
    if (data && data.result) {
      setOutput(JSON.stringify(data.result, null, 2));
    } else {
      setOutput("Error: No result returned from API");
    }
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

        {error && (
          <div className="text-red-400 mb-4 font-bold p-3 bg-red-500/10 rounded border border-red-500/20">
            Error: {error}
          </div>
        )}

        <div className="flex gap-2 mb-4 border-b border-gray-800">
          {['format', 'repair', 'query'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-2 ${tab === t ? 'border-b-2 border-blue-500 text-white' : 'text-gray-500'}`}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          className="bg-[#161b22] w-full h-48 p-3 rounded font-mono text-sm border border-gray-800 mb-4"
          placeholder='{"broken": json, trailing:,}'
        />

        {tab === 'format' && (
          <div className="flex gap-2 mb-4">
            <button onClick={() => format(false)} disabled={loading} className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Working...' : 'Format'}
            </button>
            <button onClick={() => format(true)} disabled={loading} className="bg-gray-700 px-4 py-2 rounded hover:bg-gray-600 disabled:opacity-50">
              {loading ? 'Working...' : 'Minify'}
            </button>
          </div>
        )}

        {tab === 'repair' && (
          <div className="mb-4">
            <button onClick={repair} disabled={loading} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50">
              {loading ? 'Fixing...' : 'Fix Broken JSON'}
            </button>
          </div>
        )}

        {tab === 'query' && (
          <div className="mb-4 flex gap-2">
            <input value={jsonPath} onChange={e => setJsonPath(e.target.value)}
              className="bg-[#161b22] p-2 rounded flex-1 border border-gray-800 font-mono text-sm" />
            <button onClick={query} disabled={loading} className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50">
              {loading ? 'Querying...' : 'Query'}
            </button>
          </div>
        )}

        <pre className="bg-[#161b22] p-3 rounded overflow-auto h-64 border border-gray-800 text-sm">
          {loading ? 'Processing...' : output || 'Result will appear here...'}
        </pre>
      </div>
    </>
  );
          }
