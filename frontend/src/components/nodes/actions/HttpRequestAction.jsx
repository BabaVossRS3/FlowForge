import { useState, useEffect } from 'react'
import { Globe, Plus, Trash2 } from 'lucide-react'

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

export default function HttpRequestAction({ config, onChange }) {
  const [url, setUrl] = useState(config.url || '')
  const [method, setMethod] = useState(config.method || 'GET')
  const [headers, setHeaders] = useState(config.headers || [])
  const [body, setBody] = useState(config.body || '')
  const [timeout, setTimeout] = useState(config.timeout || 30)

  useEffect(() => {
    onChange({
      url,
      method,
      headers,
      body,
      timeout,
    })
  }, [url, method, headers, body, timeout])

  const addHeader = () => {
    setHeaders([...headers, { key: '', value: '' }])
  }

  const updateHeader = (index, field, value) => {
    const newHeaders = [...headers]
    newHeaders[index][field] = value
    setHeaders(newHeaders)
  }

  const removeHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3!">
      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          <Globe size={14} className="inline! mr-1!" />
          URL
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/endpoint"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
      </div>

      <div className="grid! grid-cols-2! gap-3!">
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Method
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          >
            {httpMethods.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Timeout (seconds)
          </label>
          <input
            type="number"
            value={timeout}
            onChange={(e) => setTimeout(Number(e.target.value))}
            min="1"
            max="300"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          />
        </div>
      </div>

      <div>
        <div className="flex! items-center! justify-between! mb-2!">
          <label className="block! text-sm! text-[#999999]!">
            Headers
          </label>
          <button
            onClick={addHeader}
            className="text-xs! bg-[#2a2a3e]! hover:bg-[#3a3a4e]! text-[#e0e0e0]! px-2! py-1! rounded! transition-colors! flex! items-center! gap-1!"
          >
            <Plus size={12} />
            Add Header
          </button>
        </div>
        
        {headers.length === 0 ? (
          <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]! text-center!">
            <p className="text-xs! text-[#666666]!">No headers added</p>
          </div>
        ) : (
          <div className="space-y-2!">
            {headers.map((header, index) => (
              <div key={index} className="flex! gap-2!">
                <input
                  type="text"
                  value={header.key}
                  onChange={(e) => updateHeader(index, 'key', e.target.value)}
                  placeholder="Header name"
                  className="flex-1! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(e) => updateHeader(index, 'value', e.target.value)}
                  placeholder="Header value"
                  className="flex-1! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
                />
                <button
                  onClick={() => removeHeader(index)}
                  className="bg-[#2a2a3e]! hover:bg-red-900/30! text-red-400! px-3! py-2! rounded! transition-colors!"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Request Body (JSON)
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! font-mono! h-32!"
          />
          <p className="text-xs! text-[#666666]! mt-1!">
            Enter valid JSON for the request body
          </p>
        </div>
      )}

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <h4 className="text-xs! font-semibold! text-[#e0e0e0]! mb-2!">
          Configuration Summary
        </h4>
        <p className="text-xs! text-[#999999]!">
          Send a <strong className="text-[#85409D]!">{method}</strong> request to{' '}
          <strong className="text-[#85409D]!">{url || '(URL not set)'}</strong>
          {headers.length > 0 && ` with ${headers.length} custom header${headers.length > 1 ? 's' : ''}`}
        </p>
      </div>
    </div>
  )
}

HttpRequestAction.defaultConfig = {
  url: '',
  method: 'GET',
  headers: [],
  body: '',
  timeout: 30
}
