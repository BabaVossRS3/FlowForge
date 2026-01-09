import { X, MessageCircle, Send, MessageSquare, Hash, Phone } from 'lucide-react'
import { useState } from 'react'
import { TriggerConfig } from './nodes/triggers'
import { ActionConfig } from './nodes/actions'
import { ConditionConfig } from './nodes/conditions'
import { NotificationConfig } from './nodes/notifications'

const configTemplates = {
  trigger: {
    manually: { description: 'Trigger workflow manually' },
    schedule: { scheduleType: 'recurring', interval: '5m', specificDate: '', specificTime: '', timezone: 'UTC+2' },
    webhook: { url: '', method: 'POST' },
    chatMessage: { platform: 'whatsApp', channelOrPerson: '', keywords: '' },
  },
  action: {
    http: { url: '', method: 'GET', headers: {} },
    database: { query: '', table: '' },
    transform: { script: '' },
  },
  condition: {
    compare: { field: '', operator: '==', value: '' },
    logic: { type: 'AND' },
  },
  notification: {
    email: { to: '', subject: '', body: '' },
    webhook: { url: '', method: 'POST' },
  },
}

const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']
const scheduleTypes = ['recurring', 'specificDate', 'nextInterval']
const platformsConfig = [
  { name: 'slack', icon: MessageSquare, label: 'Slack' },
  { name: 'teams', icon: Send, label: 'Teams' },
  { name: 'discord', icon: Hash, label: 'Discord' },
  { name: 'telegram', icon: Send, label: 'Telegram' },
  { name: 'whatsApp', icon: Phone, label: 'WhatsApp' },
]

export default function NodeConfig({ node, onClose, onUpdate }) {
  const [config, setConfig] = useState(node.data.config || {})
  const [configType, setConfigType] = useState(Object.keys(config)[0] || 'webhook')

  const templates = configTemplates[node.data.type] || {}
  const currentTemplate = templates[configType] || {}

  const handleConfigChange = (key, value) => {
    setConfig({
      ...config,
      [configType]: {
        ...config[configType],
        [key]: value,
      },
    })
  }

  const handleSave = () => {
    onUpdate({
      ...node,
      data: {
        ...node.data,
        config,
      },
    })
    onClose()
  }

  return (
    <div className="fixed! inset-0! bg-black/50! flex! items-center! justify-center! z-50!">
      <div className="bg-[#1a1a1a]! border-none! rounded-lg! p-6! w-96! max-h-[90vh]! overflow-y-auto!">
        <div className="flex! items-center! justify-between! mb-4!">
          <h3 className="text-lg! font-semibold! text-[#e0e0e0]!">Configure {node.data.label}</h3>
          <button
            onClick={onClose}
            className="p-1! hover:bg-[#2a2a3e]! rounded! transition-colors!"
          >
            <X size={20} className="text-[#999999]!" />
          </button>
        </div>

        {node.data.type === 'trigger' ? (
          <div className="mb-4!">
            <TriggerConfig 
              config={config}
              onChange={setConfig}
              nodeId={node.id}
            />
          </div>
        ) : node.data.type === 'action' ? (
          <div className="mb-4!">
            <ActionConfig 
              config={config}
              onChange={setConfig}
            />
          </div>
        ) : node.data.type === 'condition' ? (
          <div className="mb-4!">
            <ConditionConfig 
              config={config}
              onChange={setConfig}
            />
          </div>
        ) : node.data.type === 'notification' ? (
          <div className="mb-4!">
            <NotificationConfig 
              config={config}
              onChange={setConfig}
            />
          </div>
        ) : (
          <>
            {Object.keys(templates).length > 0 && (
              <div className="mb-4!">
                <label className="block! text-sm! text-[#999999]! mb-2!">Configuration Type</label>
                <select
                  value={configType}
                  onChange={(e) => setConfigType(e.target.value)}
                  className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
                >
                  {Object.keys(templates).map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-3! mb-4!">
          {Object.entries(currentTemplate).map(([key, defaultValue]) => {
            const currentValue = config[configType]?.[key] || defaultValue
            
            // Handle method dropdown for webhook and action nodes
            if (key === 'method' && (configType === 'webhook' || node.data.type === 'action')) {
              return (
                <div key={key}>
                  <label className="block! text-sm! text-[#999999]! mb-1!">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <select
                    value={currentValue}
                    onChange={(e) => handleConfigChange(key, e.target.value)}
                    className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
                  >
                    {httpMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              )
            }
            
            // Handle schedule type dropdown
            if (key === 'scheduleType') {
              return (
                <div key={key}>
                  <label className="block! text-sm! text-[#999999]! mb-1!">
                    Schedule Type
                  </label>
                  <select
                    value={currentValue}
                    onChange={(e) => handleConfigChange(key, e.target.value)}
                    className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
                  >
                    <option value="recurring">Recurring (Every X time)</option>
                    <option value="specificDate">Specific Date & Time</option>
                    <option value="nextInterval">Next 5 Minutes</option>
                  </select>
                </div>
              )
            }
            
            // Handle platform dropdown for chat messages
            if (key === 'platform') {
              return (
                <div key={key}>
                  <label className="block! text-sm! text-[#999999]! mb-1!">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <select
                    value={currentValue}
                    onChange={(e) => handleConfigChange(key, e.target.value)}
                    className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
                  >
                    {platformsConfig.map((platform) => {
                      const Icon = platform.icon
                      return (
                        <option key={platform.name} value={platform.name}>
                          {platform.label}
                        </option>
                      )
                    })}
                  </select>
                </div>
              )
            }
            
            // Hide interval field if scheduleType is not recurring
            if (key === 'interval' && config[configType]?.scheduleType !== 'recurring') {
              return null
            }
            
            // Hide specificDate and specificTime if scheduleType is not specificDate
            if ((key === 'specificDate' || key === 'specificTime') && config[configType]?.scheduleType !== 'specificDate') {
              return null
            }
            
            // Default text/textarea rendering
            return (
              <div key={key}>
                <label className="block! text-sm! text-[#999999]! mb-1!">
                  {key === 'channelOrPerson' ? 'Channel / Person' : key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                {typeof defaultValue === 'object' ? (
                  <textarea
                    value={JSON.stringify(currentValue, null, 2)}
                    onChange={(e) => {
                      try {
                        const parsed = JSON.parse(e.target.value)
                        handleConfigChange(key, parsed)
                      } catch {
                        handleConfigChange(key, e.target.value)
                      }
                    }}
                    className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! font-mono! h-20!"
                  />
                ) : (
                  <input
                    type={key === 'specificDate' ? 'date' : key === 'specificTime' ? 'time' : typeof defaultValue === 'number' ? 'number' : 'text'}
                    value={currentValue}
                    onChange={(e) => handleConfigChange(key, e.target.value)}
                    className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
                  />
                )}
              </div>
            )
          })}
            </div>
          </>
        )}

        <div className="flex! gap-2!">
          <button
            onClick={handleSave}
            className="flex-1! bg-[#85409D]! hover:bg-[#a855f7]! text-white! px-4! py-2! rounded! transition-colors! text-sm! font-semibold!"
          >
            Save Configuration
          </button>
          <button
            onClick={onClose}
            className="flex-1! bg-[#2a2a3e]! hover:bg-[#3a3a4e]! text-[#e0e0e0]! px-4! py-2! rounded! transition-colors! text-sm!"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
