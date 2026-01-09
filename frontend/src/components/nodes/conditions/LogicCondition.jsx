import { useState, useEffect } from 'react'
import { Plus, Trash2, Network } from 'lucide-react'

const logicTypes = [
  { value: 'AND', label: 'AND - All conditions must be true' },
  { value: 'OR', label: 'OR - At least one condition must be true' },
  { value: 'NOT', label: 'NOT - Invert the result' },
]

const operators = [
  { value: '==', label: '==' },
  { value: '!=', label: '!=' },
  { value: '>', label: '>' },
  { value: '>=', label: '>=' },
  { value: '<', label: '<' },
  { value: '<=', label: '<=' },
  { value: 'contains', label: 'contains' },
  { value: 'isEmpty', label: 'isEmpty' },
]

export default function LogicCondition({ config, onChange }) {
  const [logicType, setLogicType] = useState(config.logicType || 'AND')
  const [conditions, setConditions] = useState(config.conditions || [
    { field: '', operator: '==', value: '' }
  ])

  useEffect(() => {
    onChange({
      logicType,
      conditions,
    })
  }, [logicType, conditions])

  const addCondition = () => {
    setConditions([...conditions, { field: '', operator: '==', value: '' }])
  }

  const updateCondition = (index, field, value) => {
    const newConditions = [...conditions]
    newConditions[index][field] = value
    setConditions(newConditions)
  }

  const removeCondition = (index) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((_, i) => i !== index))
    }
  }

  const getLogicDescription = () => {
    switch (logicType) {
      case 'AND':
        return 'All conditions below must be true for the workflow to follow the true branch.'
      case 'OR':
        return 'At least one condition below must be true for the workflow to follow the true branch.'
      case 'NOT':
        return 'The result will be inverted. If conditions are true, the false branch is taken.'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-3!">
      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <div className="flex! items-center! gap-2! mb-2!">
          <Network size={16} className="text-[#85409D]!" />
          <h4 className="text-sm! font-semibold! text-[#e0e0e0]!">
            Logic Gate
          </h4>
        </div>
        <p className="text-xs! text-[#999999]!">
          {getLogicDescription()}
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Logic Type
        </label>
        <select
          value={logicType}
          onChange={(e) => setLogicType(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {logicTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex! items-center! justify-between! mb-2!">
          <label className="block! text-sm! text-[#999999]!">
            Conditions ({conditions.length})
          </label>
          <button
            onClick={addCondition}
            className="text-xs! bg-[#2a2a3e]! hover:bg-[#3a3a4e]! text-[#e0e0e0]! px-2! py-1! rounded! transition-colors! flex! items-center! gap-1!"
          >
            <Plus size={12} />
            Add Condition
          </button>
        </div>

        <div className="space-y-2!">
          {conditions.map((condition, index) => (
            <div key={index} className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
              <div className="flex! items-start! gap-2!">
                <div className="flex-1! space-y-2!">
                  <input
                    type="text"
                    value={condition.field}
                    onChange={(e) => updateCondition(index, 'field', e.target.value)}
                    placeholder="Field (e.g., trigger.status)"
                    className="w-full! bg-[#1a1a2e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
                  />
                  <div className="grid! grid-cols-3! gap-2!">
                    <select
                      value={condition.operator}
                      onChange={(e) => updateCondition(index, 'operator', e.target.value)}
                      className="bg-[#1a1a2e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
                    >
                      {operators.map((op) => (
                        <option key={op.value} value={op.value}>
                          {op.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={condition.value}
                      onChange={(e) => updateCondition(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="col-span-2! bg-[#1a1a2e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
                    />
                  </div>
                </div>
                {conditions.length > 1 && (
                  <button
                    onClick={() => removeCondition(index)}
                    className="bg-[#1a1a2e]! hover:bg-red-900/30! text-red-400! p-2! rounded! transition-colors! shrink-0!"
                    title="Remove condition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              {index < conditions.length - 1 && (
                <div className="mt-2! pt-2! border-t! border-[#444]! text-center!">
                  <span className="text-xs! font-semibold! text-[#85409D]! bg-[#1a1a2e]! px-2! py-1! rounded!">
                    {logicType}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <h4 className="text-xs! font-semibold! text-[#e0e0e0]! mb-2!">
          Logic Summary
        </h4>
        <div className="text-xs! text-[#999999]! space-y-1!">
          {logicType === 'NOT' && <div className="text-[#85409D]!">NOT (</div>}
          {conditions.map((condition, index) => (
            <div key={index} className="flex! items-center! gap-2!">
              {index > 0 && (
                <span className="text-[#85409D]! font-semibold!">{logicType}</span>
              )}
              <code className="text-[#e0e0e0]!">
                {condition.field || '(field)'} {condition.operator} {condition.value || '(value)'}
              </code>
            </div>
          ))}
          {logicType === 'NOT' && <div className="text-[#85409D]!">)</div>}
        </div>
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <h4 className="text-xs! font-semibold! text-[#85409D]! mb-2!">
          Examples
        </h4>
        <div className="space-y-1! text-xs! text-[#999999]!">
          <div><strong>AND:</strong> User is active AND has premium subscription</div>
          <div><strong>OR:</strong> Payment failed OR subscription expired</div>
          <div><strong>NOT:</strong> NOT (user is blocked)</div>
        </div>
      </div>
    </div>
  )
}

LogicCondition.defaultConfig = {
  logicType: 'AND',
  conditions: [
    { field: '', operator: '==', value: '' }
  ]
}
