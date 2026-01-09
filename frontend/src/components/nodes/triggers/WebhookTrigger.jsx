import { useState, useEffect } from 'react'
import { Copy, Check, RefreshCw } from 'lucide-react'

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']

export default function WebhookTrigger({ config, onChange }) {
  const [webhookUrl, setWebhookUrl] = useState(config.url || '')
  const [method, setMethod] = useState(config.method || 'POST')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!config.url) {
      generateWebhookUrl()
    }
  }, [])

  const generateWebhookUrl = () => {
    const uniqueId = `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'
    const newUrl = `${baseUrl}/webhooks/${uniqueId}`
    setWebhookUrl(newUrl)
    onChange({ ...config, url: newUrl, method })
  }

  const handleMethodChange = (newMethod) => {
    setMethod(newMethod)
    onChange({ ...config, method: newMethod, url: webhookUrl })
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-3!">
      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          HTTP Method
        </label>
        <select
          value={method}
          onChange={(e) => handleMethodChange(e.target.value)}
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
          Webhook URL
        </label>
        <div className="flex! gap-2!">
          <input
            type="text"
            value={webhookUrl}
            readOnly
            className="flex-1! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! font-mono!"
          />
          <button
            onClick={copyToClipboard}
            className="bg-[#2a2a3e]! hover:bg-[#3a3a4e]! text-[#e0e0e0]! px-3! py-2! rounded! transition-colors! shrink-0!"
            title="Copy URL"
          >
            {copied ? <Check size={16} className="text-green-400!" /> : <Copy size={16} />}
          </button>
          <button
            onClick={generateWebhookUrl}
            className="bg-[#2a2a3e]! hover:bg-[#3a3a4e]! text-[#e0e0e0]! px-3! py-2! rounded! transition-colors! shrink-0!"
            title="Regenerate URL"
          >
            <RefreshCw size={16} />
          </button>
        </div>
        <p className="text-xs! text-[#666666]! mt-2!">
          Send {method} requests to this URL to trigger the workflow
        </p>
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <h4 className="text-xs! font-semibold! text-[#e0e0e0]! mb-2!">
          Example Request
        </h4>
        <pre className="text-xs! text-[#999999]! font-mono! overflow-x-auto!">
{`curl -X ${method} \\
  ${webhookUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"key": "value"}'`}
        </pre>
      </div>
    </div>
  )
}

WebhookTrigger.defaultConfig = {
  url: '',
  method: 'POST'
}
