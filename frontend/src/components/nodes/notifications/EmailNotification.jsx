import { useState, useEffect } from 'react'
import { Mail, Plus, Trash2 } from 'lucide-react'

const priorities = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]

export default function EmailNotification({ config, onChange }) {
  const [to, setTo] = useState(config.to || '')
  const [subject, setSubject] = useState(config.subject || '')
  const [body, setBody] = useState(config.body || '')
  const [priority, setPriority] = useState(config.priority || 'normal')
  const [replyTo, setReplyTo] = useState(config.replyTo || '')

  useEffect(() => {
    onChange({
      to,
      subject,
      body,
      priority,
      replyTo,
    })
  }, [to, subject, body, priority, replyTo])

  return (
    <div className="space-y-3!">
      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <div className="flex! items-center! gap-2! mb-2!">
          <Mail size={16} className="text-[#85409D]!" />
          <h4 className="text-sm! font-semibold! text-[#e0e0e0]!">
            Email Notification
          </h4>
        </div>
        <p className="text-xs! text-[#999999]!">
          Send an email notification to specified recipients
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          To (Recipients)
        </label>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="user@example.com, another@example.com"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          Comma-separated email addresses or use {'{{variable}}'} for dynamic recipients
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Notification: {{event.type}}"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Message Body
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Your notification message... Use {{variable}} for dynamic content"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! h-32!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          Plain text format with workflow variable support
        </p>
      </div>

      <div className="grid! grid-cols-2! gap-3!">
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          >
            {priorities.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Reply-To (Optional)
          </label>
          <input
            type="text"
            value={replyTo}
            onChange={(e) => setReplyTo(e.target.value)}
            placeholder="noreply@example.com"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          />
        </div>
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <h4 className="text-xs! font-semibold! text-[#e0e0e0]! mb-2!">
          Configuration Summary
        </h4>
        <p className="text-xs! text-[#999999]!">
          Send <strong className="text-[#85409D]!">{priority}</strong> priority email to{' '}
          <strong className="text-[#85409D]!">{to || '(no recipients)'}</strong>
          {subject && ` with subject "${subject}"`}
        </p>
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <p className="text-xs! text-[#999999]!">
          <strong className="text-[#85409D]!">Note:</strong> Requires SMTP configuration or email service integration.
        </p>
      </div>
    </div>
  )
}

EmailNotification.defaultConfig = {
  to: '',
  subject: '',
  body: '',
  priority: 'normal',
  replyTo: ''
}
