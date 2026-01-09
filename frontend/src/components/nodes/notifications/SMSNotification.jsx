import { useState, useEffect } from 'react'
import { Phone } from 'lucide-react'

export default function SMSNotification({ config, onChange }) {
  const [phoneNumber, setPhoneNumber] = useState(config.phoneNumber || '')
  const [message, setMessage] = useState(config.message || '')
  const [sender, setSender] = useState(config.sender || '')

  useEffect(() => {
    onChange({
      phoneNumber,
      message,
      sender,
    })
  }, [phoneNumber, message, sender])

  const messageLength = message.length
  const smsCount = Math.ceil(messageLength / 160)

  return (
    <div className="space-y-3!">
      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <div className="flex! items-center! gap-2! mb-2!">
          <Phone size={16} className="text-[#85409D]!" />
          <h4 className="text-sm! font-semibold! text-[#e0e0e0]!">
            SMS Notification
          </h4>
        </div>
        <p className="text-xs! text-[#999999]!">
          Send an SMS text message to a phone number
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Phone Number
        </label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+1234567890"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          Include country code (e.g., +1 for US, +44 for UK)
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Sender ID (Optional)
        </label>
        <input
          type="text"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          placeholder="FlowForge"
          maxLength={11}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          Custom sender name (max 11 characters, not supported in all countries)
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your SMS message... Keep it short and clear"
          maxLength={1600}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! h-32!"
        />
        <div className="flex! justify-between! items-center! mt-1!">
          <p className="text-xs! text-[#666666]!">
            Plain text only, no HTML or markdown
          </p>
          <div className="text-xs! text-[#999999]!">
            <span className={messageLength > 160 ? 'text-yellow-500!' : ''}>
              {messageLength}/1600
            </span>
            <span className="ml-2! text-[#666666]!">
              ({smsCount} SMS{smsCount > 1 ? 's' : ''})
            </span>
          </div>
        </div>
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <h4 className="text-xs! font-semibold! text-[#e0e0e0]! mb-2!">
          Configuration Summary
        </h4>
        <p className="text-xs! text-[#999999]!">
          Send SMS to <strong className="text-[#85409D]!">{phoneNumber || '(no number)'}</strong>
          {sender && ` from ${sender}`}
          {messageLength > 0 && ` (${smsCount} message${smsCount > 1 ? 's' : ''})`}
        </p>
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-yellow-600/30!">
        <p className="text-xs! text-[#999999]!">
          <strong className="text-yellow-500!">Cost:</strong> SMS messages are charged per segment (160 characters). Messages longer than 160 characters will be split into multiple SMS.
        </p>
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <p className="text-xs! text-[#999999]!">
          <strong className="text-[#85409D]!">Note:</strong> Requires SMS service provider integration (Twilio, AWS SNS, etc.).
        </p>
      </div>
    </div>
  )
}

SMSNotification.defaultConfig = {
  phoneNumber: '',
  message: '',
  sender: ''
}
