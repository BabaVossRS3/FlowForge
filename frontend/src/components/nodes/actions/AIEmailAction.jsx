import { useState, useEffect } from 'react'
import { Sparkles, AlertCircle } from 'lucide-react'

const emailToneOptions = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'empathetic', label: 'Empathetic', description: 'Understanding and supportive' },
  { value: 'apologetic', label: 'Apologetic', description: 'Regretful and solution-focused' },
  { value: 'grateful', label: 'Grateful', description: 'Thankful and appreciative' },
]

const emailContextTypes = [
  { value: 'complaint', label: 'Complaint Response', description: 'Respond to customer complaints' },
  { value: 'approval', label: 'Approval Confirmation', description: 'Confirm approval/agreement' },
  { value: 'inquiry', label: 'Inquiry Response', description: 'Answer customer questions' },
  { value: 'feedback', label: 'Feedback Response', description: 'Respond to feedback' },
  { value: 'custom', label: 'Custom Context', description: 'Define your own context' },
]

export default function AIEmailAction({ config, onChange }) {
  const [tone, setTone] = useState(config.tone || 'professional')
  const [contextType, setContextType] = useState(config.contextType || 'complaint')
  const [customContext, setCustomContext] = useState(config.customContext || '')
  const [includeCallToAction, setIncludeCallToAction] = useState(config.includeCallToAction !== false)
  const [callToActionText, setCallToActionText] = useState(config.callToActionText || 'Please let us know if you need further assistance.')
  const [recipientEmail, setRecipientEmail] = useState(config.recipientEmail || '')
  const [fromEmail, setFromEmail] = useState(config.fromEmail || '')

  useEffect(() => {
    onChange({
      tone,
      contextType,
      customContext,
      includeCallToAction,
      callToActionText,
      recipientEmail,
      fromEmail
    })
  }, [tone, contextType, customContext, includeCallToAction, callToActionText, recipientEmail, fromEmail])

  const selectedContext = emailContextTypes.find(t => t.value === contextType)

  return (
    <div className="space-y-4!">
      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <div className="flex! items-center! gap-2! mb-2!">
          <Sparkles size={16} className="text-[#85409D]!" />
          <h4 className="text-sm! font-semibold! text-[#e0e0e0]!">
            AI Email Generation
          </h4>
        </div>
        <p className="text-xs! text-[#999999]!">
          AI will automatically generate a contextual email response based on the trigger message and condition result.
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Email Context Type
        </label>
        <select
          value={contextType}
          onChange={(e) => setContextType(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {emailContextTypes.map((type) => (
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
            Custom Context Description
          </label>
          <textarea
            value={customContext}
            onChange={(e) => setCustomContext(e.target.value)}
            placeholder="Describe the context for the email. E.g., 'Customer is asking about refund policy'"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! font-mono! h-20! resize-none!"
          />
        </div>
      )}

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Email Tone
        </label>
        <select
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {emailToneOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {emailToneOptions.find(o => o.value === tone) && (
          <p className="text-xs! text-[#666666]! mt-1!">
            {emailToneOptions.find(o => o.value === tone).description}
          </p>
        )}
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Recipient Email (Optional)
        </label>
        <input
          type="email"
          value={recipientEmail}
          onChange={(e) => setRecipientEmail(e.target.value)}
          placeholder="customer@example.com or leave empty to use trigger sender"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          Leave empty to automatically use the sender from the trigger message
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          From Email (Optional)
        </label>
        <input
          type="email"
          value={fromEmail}
          onChange={(e) => setFromEmail(e.target.value)}
          placeholder="support@company.com"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          Leave empty to use default sender from email integration
        </p>
      </div>

      <div>
        <label className="flex! items-center! gap-2! text-sm! text-[#999999]! cursor-pointer!">
          <input
            type="checkbox"
            checked={includeCallToAction}
            onChange={(e) => setIncludeCallToAction(e.target.checked)}
            className="bg-[#2a2a3e]! border-[#444]! rounded!"
          />
          Include Call to Action
        </label>
      </div>

      {includeCallToAction && (
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Call to Action Text
          </label>
          <textarea
            value={callToActionText}
            onChange={(e) => setCallToActionText(e.target.value)}
            placeholder="E.g., 'Please reply with your account details so we can help you.'"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! h-16! resize-none!"
          />
        </div>
      )}

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <div className="flex! gap-2! mb-2!">
          <AlertCircle size={14} className="text-[#85409D]! shrink-0! mt-0.5!" />
          <div>
            <h4 className="text-xs! font-semibold! text-[#85409D]! mb-1!">
              How It Works
            </h4>
            <ul className="text-xs! text-[#999999]! space-y-1!">
              <li>• AI reads the trigger message</li>
              <li>• Generates contextual email based on context type and tone</li>
              <li>• Automatically sends to recipient</li>
              <li>• Includes call to action if enabled</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <h4 className="text-xs! font-semibold! text-[#85409D]! mb-2!">
          Example Workflow
        </h4>
        <div className="space-y-2! text-xs! text-[#999999]!">
          <div>
            <strong className="text-[#e0e0e0]!">Complaint Detection:</strong>
            <p>Message detected as complaint → AI generates empathetic apology email → Sent to customer</p>
          </div>
          <div>
            <strong className="text-[#e0e0e0]!">Approval Confirmation:</strong>
            <p>Message detected as approval → AI generates grateful confirmation email → Sent to customer</p>
          </div>
        </div>
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <p className="text-xs! text-[#999999]!">
          <strong className="text-[#85409D]!">Note:</strong> Requires email integration configured and GEMINI_API_KEY set in backend.
        </p>
      </div>
    </div>
  )
}

AIEmailAction.defaultConfig = {
  tone: 'professional',
  contextType: 'complaint',
  customContext: '',
  includeCallToAction: true,
  callToActionText: 'Please let us know if you need further assistance.',
  recipientEmail: '',
  fromEmail: ''
}
