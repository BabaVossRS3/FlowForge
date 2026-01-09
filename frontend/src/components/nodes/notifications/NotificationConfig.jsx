import { useState } from 'react'
import SlackNotification from './SlackNotification'
import EmailNotification from './EmailNotification'
import SMSNotification from './SMSNotification'
import PushNotification from './PushNotification'
import WebhookNotification from './WebhookNotification'
import AISMSNotification from './AISMSNotification'

const notificationTypes = [
  { value: 'slack', label: 'Slack Message', component: SlackNotification },
  { value: 'email', label: 'Email', component: EmailNotification },
  { value: 'sms', label: 'SMS', component: SMSNotification },
  { value: 'aiSms', label: 'AI SMS Generation', component: AISMSNotification },
  { value: 'push', label: 'Push Notification', component: PushNotification },
  { value: 'webhook', label: 'Webhook', component: WebhookNotification },
]

export default function NotificationConfig({ config, onChange }) {
  const [selectedType, setSelectedType] = useState(
    Object.keys(config)[0] || 'slack'
  )

  const handleTypeChange = (newType) => {
    setSelectedType(newType)
    const NotificationComponent = notificationTypes.find(t => t.value === newType)?.component
    if (NotificationComponent && NotificationComponent.defaultConfig) {
      onChange({ [newType]: NotificationComponent.defaultConfig })
    }
  }

  const handleConfigChange = (newConfig) => {
    onChange({ [selectedType]: newConfig })
  }

  const SelectedNotificationComponent = notificationTypes.find(
    t => t.value === selectedType
  )?.component

  return (
    <div className="space-y-4!">
      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Notification Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {notificationTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {SelectedNotificationComponent && (
        <SelectedNotificationComponent
          config={config[selectedType] || {}}
          onChange={handleConfigChange}
        />
      )}
    </div>
  )
}
