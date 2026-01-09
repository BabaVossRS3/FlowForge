import { useState, useEffect } from 'react'
import { Sparkles, AlertCircle } from 'lucide-react'

const chatContextTypes = [
  { value: 'response', label: 'Direct Response', description: 'Reply directly to the message' },
  { value: 'complaint', label: 'Complaint Response', description: 'Respond to complaints/issues' },
  { value: 'approval', label: 'Approval Confirmation', description: 'Confirm approval/agreement' },
  { value: 'inquiry', label: 'Inquiry Response', description: 'Answer questions' },
  { value: 'feedback', label: 'Feedback Response', description: 'Respond to feedback' },
  { value: 'custom', label: 'Custom Message', description: 'Define your own message' },
]

const messageToneOptions = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'empathetic', label: 'Empathetic', description: 'Understanding and supportive' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
]

export default function AIChatMessageAction({ config, onChange }) {
  const [contextType, setContextType] = useState(config.contextType || 'response')
  const [customPrompt, setCustomPrompt] = useState(config.customPrompt || '')
  const [tone, setTone] = useState(config.tone || 'friendly')
  const [includeEmoji, setIncludeEmoji] = useState(config.includeEmoji !== false)
  const [messageLength, setMessageLength] = useState(config.messageLength || 'medium')
  const [autoReply, setAutoReply] = useState(config.autoReply !== false)

  useEffect(() => {
    onChange({
      contextType,
      customPrompt,
      tone,
      includeEmoji,
      messageLength,
      autoReply
    })
  }, [contextType, customPrompt, tone, includeEmoji, messageLength, autoReply])

  const selectedContext = chatContextTypes.find(t => t.value === contextType)
  const selectedTone = messageToneOptions.find(t => t.value === tone)

  return (
    <div className="space-y-4!">
      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <div className="flex! items-center! gap-2! mb-2!">
          <Sparkles size={16} className="text-[#85409D]!" />
          <h4 className="text-sm! font-semibold! text-[#e0e0e0]!">
            AI Chat Message Reply
          </h4>
        </div>
        <p className="text-xs! text-[#999999]!">
          AI generates and sends a contextual reply on the same platform the message came from (WhatsApp, Slack, etc.).
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Response Context
        </label>
        <select
          value={contextType}
          onChange={(e) => setContextType(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {chatContextTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {selectedContext && (
          <p className="text-xs! text-[#666666]! mt-1!">
            {selectedContext.description}
          </p>
        )}
      </div>

      {contextType === 'custom' && (
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Custom Message Prompt
          </label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Describe the message to send. E.g., 'Thank them for their order and provide tracking info'"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! h-20! resize-none!"
          />
        </div>
      )}

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Message Tone
        </label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {messageToneOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {selectedTone && (
          <p className="text-xs! text-[#666666]! mt-1!">
            {selectedTone.description}
          </p>
        )}
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Message Length
        </label>
        <select
          value={messageLength}
          onChange={(e) => setMessageLength(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          <option value="short">Short (1-2 sentences)</option>
          <option value="medium">Medium (2-3 sentences)</option>
          <option value="long">Long (3-5 sentences)</option>
        </select>
      </div>

      <div>
        <label className="flex! items-center! gap-2! text-sm! text-[#999999]! cursor-pointer!">
          <input
            type="checkbox"
            checked={includeEmoji}
            onChange={(e) => setIncludeEmoji(e.target.checked)}
            className="bg-[#2a2a3e]! border-[#444]! rounded!"
          />
          Include Emojis
        </label>
        <p className="text-xs! text-[#666666]! mt-1!">
          Add relevant emojis to make messages more engaging
        </p>
      </div>

      <div>
        <label className="flex! items-center! gap-2! text-sm! text-[#999999]! cursor-pointer!">
          <input
            type="checkbox"
            checked={autoReply}
            onChange={(e) => setAutoReply(e.target.checked)}
            className="bg-[#2a2a3e]! border-[#444]! rounded!"
          />
          Auto-Reply Immediately
        </label>
        <p className="text-xs! text-[#666666]! mt-1!">
          Send reply immediately when condition is met
        </p>
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <div className="flex! gap-2! mb-2!">
          <AlertCircle size={14} className="text-[#85409D]! shrink-0! mt-0.5!" />
          <div>
            <h4 className="text-xs! font-semibold! text-[#85409D]! mb-1!">
              How It Works
            </h4>
            <ul className="text-xs! text-[#999999]! space-y-1!">
              <li>• Detects platform from incoming message (WhatsApp, Slack, Discord, etc.)</li>
              <li>• AI generates contextual reply based on original message</li>
              <li>• Automatically sends reply on same platform</li>
              <li>• Tracks sender and maintains conversation context</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <h4 className="text-xs! font-semibold! text-[#85409D]! mb-2!">
          Example Workflows
        </h4>
        <div className="space-y-2! text-xs! text-[#999999]!">
          <div>
            <strong className="text-[#e0e0e0]!">WhatsApp Support:</strong>
            <p>Customer sends message → AI detects issue → Replies on WhatsApp with solution</p>
          </div>
          <div>
            <strong className="text-[#e0e0e0]!">Slack Notifications:</strong>
            <p>Team member asks question → AI responds in Slack thread automatically</p>
          </div>
          <div>
            <strong className="text-[#e0e0e0]!">Discord Community:</strong>
            <p>User posts question → AI replies in Discord with helpful answer</p>
          </div>
        </div>
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <p className="text-xs! text-[#999999]!">
          <strong className="text-[#85409D]!">Note:</strong> Requires platform integrations configured (WhatsApp, Slack, Discord, etc.) and GEMINI_API_KEY set in backend.
        </p>
      </div>
    </div>
  )
}

AIChatMessageAction.defaultConfig = {
  contextType: 'response',
  customPrompt: '',
  tone: 'friendly',
  includeEmoji: true,
  messageLength: 'medium',
  autoReply: true
}
