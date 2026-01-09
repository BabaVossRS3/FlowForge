import { useState, useEffect } from 'react'
import { Mail, Plus, Trash2 } from 'lucide-react'

export default function EmailAction({ config, onChange }) {
  const [to, setTo] = useState(config.to || '')
  const [cc, setCc] = useState(config.cc || '')
  const [bcc, setBcc] = useState(config.bcc || '')
  const [subject, setSubject] = useState(config.subject || '')
  const [body, setBody] = useState(config.body || '')
  const [isHtml, setIsHtml] = useState(config.isHtml || false)
  const [attachments, setAttachments] = useState(config.attachments || [])

  useEffect(() => {
    onChange({
      to,
      cc,
      bcc,
      subject,
      body,
      isHtml,
      attachments,
    })
  }, [to, cc, bcc, subject, body, isHtml, attachments])

  const addAttachment = () => {
    setAttachments([...attachments, { name: '', url: '' }])
  }

  const updateAttachment = (index, field, value) => {
    const newAttachments = [...attachments]
    newAttachments[index][field] = value
    setAttachments(newAttachments)
  }

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-3!">
      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          <Mail size={14} className="inline! mr-1!" />
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
          Separate multiple emails with commas
        </p>
      </div>

      <div className="grid! grid-cols-2! gap-3!">
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            CC (Optional)
          </label>
          <input
            type="text"
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            placeholder="cc@example.com"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          />
        </div>

        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            BCC (Optional)
          </label>
          <input
            type="text"
            value={bcc}
            onChange={(e) => setBcc(e.target.value)}
            placeholder="bcc@example.com"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          />
        </div>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Email subject line"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
      </div>

      <div>
        <div className="flex! items-center! justify-between! mb-2!">
          <label className="block! text-sm! text-[#999999]!">
            Email Body
          </label>
          <label className="flex! items-center! gap-2! text-xs! text-[#999999]!">
            <input
              type="checkbox"
              checked={isHtml}
              onChange={(e) => setIsHtml(e.target.checked)}
              className="bg-[#2a2a3e]! border-[#444]! rounded!"
            />
            HTML Format
          </label>
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={isHtml ? '<h1>Hello</h1><p>Your email content here</p>' : 'Your email content here...'}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! font-mono! h-40!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          {isHtml ? 'Use HTML tags for formatting' : 'Plain text email body'}
        </p>
      </div>

      <div>
        <div className="flex! items-center! justify-between! mb-2!">
          <label className="block! text-sm! text-[#999999]!">
            Attachments (Optional)
          </label>
          <button
            onClick={addAttachment}
            className="text-xs! bg-[#2a2a3e]! hover:bg-[#3a3a4e]! text-[#e0e0e0]! px-2! py-1! rounded! transition-colors! flex! items-center! gap-1!"
          >
            <Plus size={12} />
            Add Attachment
          </button>
        </div>
        
        {attachments.length === 0 ? (
          <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]! text-center!">
            <p className="text-xs! text-[#666666]!">No attachments</p>
          </div>
        ) : (
          <div className="space-y-2!">
            {attachments.map((attachment, index) => (
              <div key={index} className="flex! gap-2!">
                <input
                  type="text"
                  value={attachment.name}
                  onChange={(e) => updateAttachment(index, 'name', e.target.value)}
                  placeholder="filename.pdf"
                  className="flex-1! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
                />
                <input
                  type="text"
                  value={attachment.url}
                  onChange={(e) => updateAttachment(index, 'url', e.target.value)}
                  placeholder="https://example.com/file.pdf"
                  className="flex-2! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
                />
                <button
                  onClick={() => removeAttachment(index)}
                  className="bg-[#2a2a3e]! hover:bg-red-900/30! text-red-400! px-3! py-2! rounded! transition-colors!"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <h4 className="text-xs! font-semibold! text-[#e0e0e0]! mb-2!">
          Configuration Summary
        </h4>
        <p className="text-xs! text-[#999999]!">
          Send {isHtml ? 'HTML' : 'plain text'} email to{' '}
          <strong className="text-[#85409D]!">{to || '(no recipients)'}</strong>
          {subject && ` with subject "${subject}"`}
          {attachments.length > 0 && ` with ${attachments.length} attachment${attachments.length > 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <p className="text-xs! text-[#999999]!">
          <strong className="text-[#85409D]!">Note:</strong> You'll need to configure SMTP settings or connect an email service provider in the integrations settings.
        </p>
      </div>
    </div>
  )
}

EmailAction.defaultConfig = {
  to: '',
  cc: '',
  bcc: '',
  subject: '',
  body: '',
  isHtml: false,
  attachments: []
}
