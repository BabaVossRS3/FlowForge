import { useState, useEffect } from 'react'
import { Bell, Smartphone } from 'lucide-react'

const platforms = [
  { value: 'all', label: 'All Platforms' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'web', label: 'Web' },
]

export default function PushNotification({ config, onChange }) {
  const [platform, setPlatform] = useState(config.platform || 'all')
  const [title, setTitle] = useState(config.title || '')
  const [body, setBody] = useState(config.body || '')
  const [icon, setIcon] = useState(config.icon || '')
  const [url, setUrl] = useState(config.url || '')
  const [badge, setBadge] = useState(config.badge || '')
  const [sound, setSound] = useState(config.sound || 'default')

  useEffect(() => {
    onChange({
      platform,
      title,
      body,
      icon,
      url,
      badge,
      sound,
    })
  }, [platform, title, body, icon, url, badge, sound])

  return (
    <div className="space-y-3!">
      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <div className="flex! items-center! gap-2! mb-2!">
          <Bell size={16} className="text-[#85409D]!" />
          <h4 className="text-sm! font-semibold! text-[#e0e0e0]!">
            Push Notification
          </h4>
        </div>
        <p className="text-xs! text-[#999999]!">
          Send a push notification to user devices
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          <Smartphone size={14} className="inline! mr-1!" />
          Target Platform
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
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Notification Title"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Message
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Your notification message..."
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! h-24!"
        />
      </div>

      <div className="grid! grid-cols-2! gap-3!">
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Icon URL (Optional)
          </label>
          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="https://example.com/icon.png"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          />
        </div>

        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Badge Count (Optional)
          </label>
          <input
            type="number"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="1"
            min="0"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          />
        </div>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Click Action URL (Optional)
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/page"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          URL to open when notification is clicked
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Sound
        </label>
        <select
          value={sound}
          onChange={(e) => setSound(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          <option value="default">Default</option>
          <option value="none">None (Silent)</option>
          <option value="custom">Custom Sound</option>
        </select>
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <h4 className="text-xs! font-semibold! text-[#e0e0e0]! mb-2!">
          Configuration Summary
        </h4>
        <p className="text-xs! text-[#999999]!">
          Send push to <strong className="text-[#85409D]!">{platform === 'all' ? 'all platforms' : platform}</strong>
          {title && ` with title "${title}"`}
          {badge && ` (badge: ${badge})`}
        </p>
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <p className="text-xs! text-[#999999]!">
          <strong className="text-[#85409D]!">Note:</strong> Requires push notification service integration (Firebase, OneSignal, etc.) and user device tokens.
        </p>
      </div>
    </div>
  )
}

PushNotification.defaultConfig = {
  platform: 'all',
  title: '',
  body: '',
  icon: '',
  url: '',
  badge: '',
  sound: 'default'
}
