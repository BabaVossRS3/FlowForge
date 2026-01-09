import { useState } from 'react'
import HttpRequestAction from './HttpRequestAction'
import DatabaseAction from './DatabaseAction'
import DataTransformAction from './DataTransformAction'
import EmailAction from './EmailAction'
import AIEmailAction from './AIEmailAction'
import AIDataTransformAction from './AIDataTransformAction'
import AIChatMessageAction from './AIChatMessageAction'

const actionTypes = [
  { value: 'http', label: 'HTTP Request', component: HttpRequestAction },
  { value: 'database', label: 'Database Query', component: DatabaseAction },
  { value: 'transform', label: 'Data Transform', component: DataTransformAction },
  { value: 'aiTransform', label: 'AI Data Transform', component: AIDataTransformAction },
  { value: 'email', label: 'Send Email', component: EmailAction },
  { value: 'aiEmail', label: 'AI Email Generation', component: AIEmailAction },
  { value: 'aiChat', label: 'AI Chat Message Reply', component: AIChatMessageAction },
]

export default function ActionConfig({ config, onChange }) {
  const [selectedType, setSelectedType] = useState(
    Object.keys(config)[0] || 'http'
  )

  const handleTypeChange = (newType) => {
    setSelectedType(newType)
    const ActionComponent = actionTypes.find(t => t.value === newType)?.component
    if (ActionComponent && ActionComponent.defaultConfig) {
      onChange({ [newType]: ActionComponent.defaultConfig })
    }
  }

  const handleConfigChange = (newConfig) => {
    onChange({ [selectedType]: newConfig })
  }

  const SelectedActionComponent = actionTypes.find(
    t => t.value === selectedType
  )?.component

  return (
    <div className="space-y-4!">
      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Action Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {actionTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {SelectedActionComponent && (
        <SelectedActionComponent
          config={config[selectedType] || {}}
          onChange={handleConfigChange}
        />
      )}
    </div>
  )
}
