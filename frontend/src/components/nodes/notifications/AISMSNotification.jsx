import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

const smsContextTypes = [
  { value: 'alert', label: 'Alert/Notification', description: 'Send urgent alerts' },
  { value: 'confirmation', label: 'Confirmation', description: 'Confirm actions/orders' },
  { value: 'reminder', label: 'Reminder', description: 'Send reminders' },
  { value: 'followup', label: 'Follow-up', description: 'Follow up on previous interaction' },
  { value: 'custom', label: 'Custom Message', description: 'Define your own message' },
]

export default function AISMSNotification({ config, onChange }) {
  const [contextType, setContextType] = useState(config.contextType || 'alert')
  const [customMessage, setCustomMessage] = useState(config.customMessage || '')
  const [recipientPhone, setRecipientPhone] = useState(config.recipientPhone || '')
  const [characterLimit, setCharacterLimit] = useState(config.characterLimit || 160)
  const [includeLink, setIncludeLink] = useState(config.includeLink || false)
  const [linkUrl, setLinkUrl] = useState(config.linkUrl || '')

  useEffect(() => {
    onChange({
      contextType,
      customMessage,
      recipientPhone,
      characterLimit,
      includeLink,
      linkUrl
    })
  }, [contextType, customMessage, recipientPhone, characterLimit, includeLink, linkUrl])

  const selectedContext = smsContextTypes.find(t => t.value === contextType)

  return (
    <div className="space-y-4!">
      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <div className="flex! items-center! gap-2! mb-2!">
          <Sparkles size={16} className="text-[#85409D]!" />
          <h4 className="text-sm! font-semibold! text-[#e0e0e0]!">
            AI SMS Notification
          </h4>
        </div>
        <p className="text-xs! text-[#999999]!">
          AI generates concise SMS messages based on context and character limits.
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Message Context
        </label>
        <select
          value={contextType}
          onChange={(e) => setContextType(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {smsContextTypes.map((type) => (
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
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="Describe the SMS message. E.g., 'Send order confirmation with order number'"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! h-16! resize-none!"
          />
        </div>
      )}

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Recipient Phone (Optional)
        </label>
        <input
          type="tel"
          value={recipientPhone}
          onChange={(e) => setRecipientPhone(e.target.value)}
          placeholder="+1234567890 or leave empty to use trigger sender"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          Leave empty to auto-use sender from trigger
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Character Limit
        </label>
        <select
          value={characterLimit}
          onChange={(e) => setCharacterLimit(Number(e.target.value))}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          <option value={160}>160 characters (1 SMS)</option>
          <option value={320}>320 characters (2 SMS)</option>
          <option value={480}>480 characters (3 SMS)</option>
          <option value={640}>640 characters (4 SMS)</option>
        </select>
      </div>

      <div>
        <label className="flex! items-center! gap-2! text-sm! text-[#999999]! cursor-pointer!">
          <input
            type="checkbox"
            checked={includeLink}
            onChange={(e) => setIncludeLink(e.target.checked)}
            className="bg-[#2a2a3e]! border-[#444]! rounded!"
          />
          Include Link/URL
        </label>
      </div>

      {includeLink && (
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Link URL
          </label>
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          />
        </div>
      )}

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <h4 className="text-xs! font-semibold! text-[#85409D]! mb-2!">
          Examples
        </h4>
        <div className="space-y-2! text-xs! text-[#999999]!">
          <div>
            <strong className="text-[#e0e0e0]!">Alert:</strong>
            <p>"Your account has unusual activity. Verify now: [link]"</p>
          </div>
          <div>
            <strong className="text-[#e0e0e0]!">Confirmation:</strong>
            <p>"Order #12345 confirmed. Delivery in 2-3 days. Track: [link]"</p>
          </div>
          <div>
            <strong className="text-[#e0e0e0]!">Reminder:</strong>
            <p>"Appointment tomorrow at 2 PM. Reply CONFIRM to confirm."</p>
          </div>
        </div>
      </div>
    </div>
  )
}

AISMSNotification.defaultConfig = {
  contextType: 'alert',
  customMessage: '',
  recipientPhone: '',
  characterLimit: 160,
  includeLink: false,
  linkUrl: ''
}
