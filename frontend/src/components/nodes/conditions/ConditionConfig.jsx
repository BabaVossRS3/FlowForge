import { useState } from 'react'
import CompareCondition from './CompareCondition'
import LogicCondition from './LogicCondition'
import CustomCondition from './CustomCondition'
import AICondition from './AICondition'

const conditionTypes = [
  { value: 'compare', label: 'Compare Values', component: CompareCondition },
  { value: 'logic', label: 'Logic (AND/OR/NOT)', component: LogicCondition },
  { value: 'custom', label: 'Custom Expression', component: CustomCondition },
  { value: 'ai', label: 'AI Evaluation', component: AICondition },
]

export default function ConditionConfig({ config, onChange }) {
  const [selectedType, setSelectedType] = useState(
    Object.keys(config)[0] || 'compare'
  )

  const handleTypeChange = (newType) => {
    setSelectedType(newType)
    const ConditionComponent = conditionTypes.find(t => t.value === newType)?.component
    if (ConditionComponent && ConditionComponent.defaultConfig) {
      onChange({ [newType]: ConditionComponent.defaultConfig })
    }
  }

  const handleConfigChange = (newConfig) => {
    onChange({ [selectedType]: newConfig })
  }

  const SelectedConditionComponent = conditionTypes.find(
    t => t.value === selectedType
  )?.component

  return (
    <div className="space-y-4!">
      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Condition Type
        </label>
        <select
          value={selectedType}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {conditionTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {SelectedConditionComponent && (
        <SelectedConditionComponent
          config={config[selectedType] || {}}
          onChange={handleConfigChange}
        />
      )}

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <h4 className="text-xs! font-semibold! text-[#85409D]! mb-2!">
          Branching Logic
        </h4>
        <p className="text-xs! text-[#999999]! leading-relaxed!">
          Condition nodes create two branches:
        </p>
        <div className="mt-2! space-y-1!">
          <div className="flex! items-center! gap-2!">
            <div className="w-3! h-3! rounded-full! bg-green-500!"></div>
            <span className="text-xs! text-[#e0e0e0]!">True branch - Executes when condition passes</span>
          </div>
          <div className="flex! items-center! gap-2!">
            <div className="w-3! h-3! rounded-full! bg-red-500!"></div>
            <span className="text-xs! text-[#e0e0e0]!">False branch - Executes when condition fails</span>
          </div>
        </div>
        <p className="text-xs! text-[#666666]! mt-2!">
          Connect different nodes to each output handle to create branching workflows.
        </p>
      </div>
    </div>
  )
}
