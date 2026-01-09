import { useState } from 'react'
import ManualTrigger from './ManualTrigger'
import WebhookTrigger from './WebhookTrigger'
import ScheduleTrigger from './ScheduleTrigger'
import ChatMessageTrigger from './ChatMessageTrigger'

const triggerTypes = [
  { value: 'manually', label: 'Manual Trigger', component: ManualTrigger },
  { value: 'webhook', label: 'Webhook', component: WebhookTrigger },
  { value: 'schedule', label: 'Schedule', component: ScheduleTrigger },
  { value: 'chatMessage', label: 'Chat Message', component: ChatMessageTrigger },
]

export default function TriggerConfig({ config, onChange, nodeId }) {
  const [selectedType, setSelectedType] = useState(
    Object.keys(config)[0] || 'manually'
  )

  const handleTypeChange = (newType) => {
    setSelectedType(newType)
    const TriggerComponent = triggerTypes.find(t => t.value === newType)?.component
    if (TriggerComponent && TriggerComponent.defaultConfig) {
      onChange({ [newType]: TriggerComponent.defaultConfig })
    }
  }

  const handleConfigChange = (newConfig) => {
    onChange({ [selectedType]: newConfig })
  }

  const SelectedTriggerComponent = triggerTypes.find(
    t => t.value === selectedType
  )?.component

  return (
    <div className="space-y-4!">
      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Trigger Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {triggerTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {SelectedTriggerComponent && (
        <SelectedTriggerComponent
          config={config[selectedType] || {}}
          onChange={handleConfigChange}
          nodeId={nodeId}
        />
      )}
    </div>
  )
}
