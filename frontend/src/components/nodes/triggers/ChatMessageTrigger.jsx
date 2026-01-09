import { useState, useEffect } from 'react'
import { MessageSquare, Send, Hash, Phone } from 'lucide-react'
import { useTriggerOutputs } from '../../../context/TriggerOutputContext'

const platforms = [
  { value: 'slack', label: 'Slack', icon: MessageSquare },
  { value: 'teams', label: 'Microsoft Teams', icon: Send },
  { value: 'discord', label: 'Discord', icon: Hash },
  { value: 'telegram', label: 'Telegram', icon: Send },
  { value: 'whatsapp', label: 'WhatsApp', icon: Phone },
]

export default function ChatMessageTrigger({ config, onChange, nodeId }) {
  const [platform, setPlatform] = useState(config.platform || 'whatsapp')
  const [channelOrPerson, setChannelOrPerson] = useState(config.channelOrPerson || '')
  const [keywords, setKeywords] = useState(config.keywords || '')
  const [matchType, setMatchType] = useState(config.matchType || 'contains')
  const { registerTriggerOutput } = useTriggerOutputs()

  useEffect(() => {
    if (nodeId) {
      registerTriggerOutput(nodeId, {
        fields: [
          { path: 'message', type: 'string', description: 'The message text' },
          { path: 'sender', type: 'string', description: 'Sender identifier (phone/username)' },
          { path: 'senderName', type: 'string', description: 'Sender display name' },
          { path: 'platform', type: 'string', description: 'Platform (whatsapp, slack, discord, etc)' },
          { path: 'channel', type: 'string', description: 'Channel or group name' },
          { path: 'timestamp', type: 'number', description: 'Message timestamp (Unix)' },
          { path: 'messageId', type: 'string', description: 'Unique message identifier' }
        ]
      })
    }
  }, [nodeId, registerTriggerOutput])

  useEffect(() => {
    onChange({
      platform,
      channelOrPerson,
      keywords,
      matchType,
    })
  }, [platform, channelOrPerson, keywords, matchType])

  const selectedPlatform = platforms.find(p => p.value === platform)
  const Icon = selectedPlatform?.icon || MessageSquare

  return (
    <div className="space-y-3!">
      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Platform
        </label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {platforms.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          <Icon size={14} className="inline! mr-1!" />
          {platform === 'slack' || platform === 'discord' ? 'Channel' : 'Person / Group'}
        </label>
        <input
          type="text"
          value={channelOrPerson}
          onChange={(e) => setChannelOrPerson(e.target.value)}
          placeholder={
            platform === 'slack' ? '#general' :
            platform === 'discord' ? '#announcements' :
            platform === 'whatsApp' ? '+1234567890' :
            platform === 'telegram' ? '@username' :
            'user@example.com'
          }
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          {platform === 'slack' && 'Enter channel name (e.g., #general)'}
          {platform === 'discord' && 'Enter channel name (e.g., #announcements)'}
          {platform === 'whatsApp' && 'Enter phone number (e.g., +1234567890)'}
          {platform === 'telegram' && 'Enter username (e.g., @username)'}
          {platform === 'teams' && 'Enter channel or user email'}
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Keywords / Trigger Words
        </label>
        <input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="help, support, urgent"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          Separate multiple keywords with commas. Leave empty to trigger on any message.
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Match Type
        </label>
        <select
          value={matchType}
          onChange={(e) => setMatchType(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          <option value="contains">Contains keyword</option>
          <option value="exact">Exact match</option>
          <option value="startsWith">Starts with keyword</option>
          <option value="any">Any message</option>
        </select>
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <h4 className="text-xs! font-semibold! text-[#e0e0e0]! mb-2!">
          Configuration Summary
        </h4>
        <p className="text-xs! text-[#999999]!">
          Trigger when a message {matchType === 'any' ? 'is received' : 
          matchType === 'exact' ? `exactly matches "${keywords}"` :
          matchType === 'startsWith' ? `starts with "${keywords}"` :
          `contains "${keywords}"`} 
          {channelOrPerson && ` in ${channelOrPerson}`} on {selectedPlatform?.label}.
        </p>
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <p className="text-xs! text-[#999999]!">
          <strong className="text-[#85409D]!">Note:</strong> You'll need to connect your {selectedPlatform?.label} account and authorize FlowForge to receive messages. This can be configured in the integrations settings.
        </p>
      </div>
    </div>
  )
}

ChatMessageTrigger.defaultConfig = {
  platform: 'whatsapp',
  channelOrPerson: '',
  keywords: '',
  matchType: 'contains'
}
