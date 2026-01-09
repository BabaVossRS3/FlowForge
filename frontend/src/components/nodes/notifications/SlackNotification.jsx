import { useState, useEffect } from 'react'
import { MessageSquare, Hash, AtSign } from 'lucide-react'

const messageTypes = [
  { value: 'channel', label: 'Channel', icon: Hash },
  { value: 'user', label: 'Direct Message', icon: AtSign },
]

export default function SlackNotification({ config, onChange }) {
  const [messageType, setMessageType] = useState(config.messageType || 'channel')
  const [target, setTarget] = useState(config.target || '')
  const [message, setMessage] = useState(config.message || '')
  const [threadTs, setThreadTs] = useState(config.threadTs || '')
  const [mentions, setMentions] = useState(config.mentions || '')

  useEffect(() => {
    onChange({
      messageType,
      target,
      message,
      threadTs,
      mentions,
    })
  }, [messageType, target, message, threadTs, mentions])

  const TargetIcon = messageTypes.find(t => t.value === messageType)?.icon || Hash

  return (
    <div className="space-y-3!">
      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <div className="flex! items-center! gap-2! mb-2!">
          <MessageSquare size={16} className="text-[#85409D]!" />
          <h4 className="text-sm! font-semibold! text-[#e0e0e0]!">
            Slack Message
          </h4>
        </div>
        <p className="text-xs! text-[#999999]!">
          Send a message to a Slack channel or user
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Message Type
        </label>
        <select
          value={messageType}
          onChange={(e) => setMessageType(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {messageTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          <TargetIcon size={14} className="inline! mr-1!" />
          {messageType === 'channel' ? 'Channel' : 'User'}
        </label>
        <input
          type="text"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder={messageType === 'channel' ? '#general' : '@username'}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          {messageType === 'channel' ? 'Enter channel name (e.g., #general)' : 'Enter username (e.g., @john.doe)'}
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your message here... Use {{variable}} for dynamic content"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! h-32!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          Supports Slack markdown and workflow variables
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Mentions (Optional)
        </label>
        <input
          type="text"
          value={mentions}
          onChange={(e) => setMentions(e.target.value)}
          placeholder="@user1, @user2, @channel"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          Comma-separated list of users or groups to mention
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Thread ID (Optional)
        </label>
        <input
          type="text"
          value={threadTs}
          onChange={(e) => setThreadTs(e.target.value)}
          placeholder="1234567890.123456"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          Reply to a specific thread by providing the thread timestamp
        </p>
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <h4 className="text-xs! font-semibold! text-[#e0e0e0]! mb-2!">
          Configuration Summary
        </h4>
        <p className="text-xs! text-[#999999]!">
          Send message to <strong className="text-[#85409D]!">{target || '(not set)'}</strong>
          {mentions && ` mentioning ${mentions}`}
          {threadTs && ' in thread'}
        </p>
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <p className="text-xs! text-[#999999]!">
          <strong className="text-[#85409D]!">Note:</strong> Requires Slack workspace integration and bot token configuration.
        </p>
      </div>
    </div>
  )
}

SlackNotification.defaultConfig = {
  messageType: 'channel',
  target: '',
  message: '',
  threadTs: '',
  mentions: ''
}
