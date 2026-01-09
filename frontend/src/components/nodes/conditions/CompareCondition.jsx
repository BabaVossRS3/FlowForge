import { useState, useEffect } from 'react'
import { GitCompare, Zap } from 'lucide-react'
import TriggerOutputSelector from './TriggerOutputSelector'

const operators = [
  { value: '==', label: 'Equals (==)', description: 'Values are equal' },
  { value: '!=', label: 'Not Equals (!=)', description: 'Values are not equal' },
  { value: '>', label: 'Greater Than (>)', description: 'Left is greater than right' },
  { value: '>=', label: 'Greater or Equal (>=)', description: 'Left is greater than or equal to right' },
  { value: '<', label: 'Less Than (<)', description: 'Left is less than right' },
  { value: '<=', label: 'Less or Equal (<=)', description: 'Left is less than or equal to right' },
  { value: 'contains', label: 'Contains', description: 'String/array contains value' },
  { value: 'startsWith', label: 'Starts With', description: 'String starts with value' },
  { value: 'endsWith', label: 'Ends With', description: 'String ends with value' },
  { value: 'matches', label: 'Matches Regex', description: 'String matches regular expression' },
  { value: 'isEmpty', label: 'Is Empty', description: 'Value is empty/null/undefined' },
  { value: 'isNotEmpty', label: 'Is Not Empty', description: 'Value exists and is not empty' },
]

const valueTypes = [
  { value: 'string', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'variable', label: 'Variable from workflow' },
  { value: 'trigger', label: 'Trigger Output' },
]

export default function CompareCondition({ config, onChange }) {
  const [leftValue, setLeftValue] = useState(config.leftValue || '')
  const [leftType, setLeftType] = useState(config.leftType || 'variable')
  const [leftTriggerId, setLeftTriggerId] = useState(config.leftTriggerId || '')
  const [leftTriggerField, setLeftTriggerField] = useState(config.leftTriggerField || '')
  const [operator, setOperator] = useState(config.operator || '==')
  const [rightValue, setRightValue] = useState(config.rightValue || '')
  const [rightType, setRightType] = useState(config.rightType || 'string')
  const [rightTriggerId, setRightTriggerId] = useState(config.rightTriggerId || '')
  const [rightTriggerField, setRightTriggerField] = useState(config.rightTriggerField || '')
  const [caseSensitive, setCaseSensitive] = useState(config.caseSensitive !== false)

  useEffect(() => {
    onChange({
      leftValue,
      leftType,
      leftTriggerId,
      leftTriggerField,
      operator,
      rightValue,
      rightType,
      rightTriggerId,
      rightTriggerField,
      caseSensitive,
    })
  }, [leftValue, leftType, leftTriggerId, leftTriggerField, operator, rightValue, rightType, rightTriggerId, rightTriggerField, caseSensitive])

  const selectedOperator = operators.find(op => op.value === operator)
  const needsRightValue = !['isEmpty', 'isNotEmpty'].includes(operator)

  return (
    <div className="space-y-3!">
      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <div className="flex! items-center! gap-2! mb-2!">
          <GitCompare size={16} className="text-[#85409D]!" />
          <h4 className="text-sm! font-semibold! text-[#e0e0e0]!">
            Comparison Setup
          </h4>
        </div>
        <p className="text-xs! text-[#999999]!">
          {selectedOperator?.description || 'Compare two values'}
        </p>
      </div>

      {/* Left Value */}
      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Left Value
        </label>
        <div className="grid! grid-cols-3! gap-2!">
          <select
            value={leftType}
            onChange={(e) => setLeftType(e.target.value)}
            className="bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          >
            {valueTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {leftType === 'trigger' ? (
            <div className="col-span-2!">
              <TriggerOutputSelector
                selectedTriggerId={leftTriggerId}
                selectedField={leftTriggerField}
                onSelect={(triggerId, field) => {
                  setLeftTriggerId(triggerId)
                  setLeftTriggerField(field)
                }}
              />
            </div>
          ) : (
            <input
              type={leftType === 'number' ? 'number' : 'text'}
              value={leftValue}
              onChange={(e) => setLeftValue(e.target.value)}
              placeholder={
                leftType === 'variable' ? 'trigger.userId' :
                leftType === 'number' ? '100' :
                leftType === 'boolean' ? 'true' :
                'Enter value'
              }
              className="col-span-2! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
            />
          )}
        </div>
        {leftType === 'variable' && (
          <p className="text-xs! text-[#666666]! mt-1!">
            Use dot notation: trigger.data, previousAction.result, workflow.variable
          </p>
        )}
        {leftType === 'trigger' && (
          <p className="text-xs! text-[#666666]! mt-1!">
            Select a trigger and its output field to use in this condition
          </p>
        )}
      </div>

      {/* Operator */}
      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Operator
        </label>
        <select
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {operators.map((op) => (
            <option key={op.value} value={op.value}>
              {op.label}
            </option>
          ))}
        </select>
      </div>

      {/* Right Value */}
      {needsRightValue && (
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Right Value
          </label>
          <div className="grid! grid-cols-3! gap-2!">
            <select
              value={rightType}
              onChange={(e) => setRightType(e.target.value)}
              className="bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
            >
              {valueTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {rightType === 'trigger' ? (
              <div className="col-span-2!">
                <TriggerOutputSelector
                  selectedTriggerId={rightTriggerId}
                  selectedField={rightTriggerField}
                  onSelect={(triggerId, field) => {
                    setRightTriggerId(triggerId)
                    setRightTriggerField(field)
                  }}
                />
              </div>
            ) : (
              <input
                type={rightType === 'number' ? 'number' : 'text'}
                value={rightValue}
                onChange={(e) => setRightValue(e.target.value)}
                placeholder={
                  rightType === 'variable' ? 'workflow.threshold' :
                  rightType === 'number' ? '100' :
                  rightType === 'boolean' ? 'true' :
                  'Enter value'
                }
                className="col-span-2! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
              />
            )}
          </div>
          {rightType === 'trigger' && (
            <p className="text-xs! text-[#666666]! mt-1!">
              Select a trigger and its output field to use in this condition
            </p>
          )}
        </div>
      )}

      {/* Case Sensitive Toggle for String Operations */}
      {['contains', 'startsWith', 'endsWith', 'matches'].includes(operator) && (
        <div>
          <label className="flex! items-center! gap-2! text-sm! text-[#999999]!">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="bg-[#2a2a3e]! border-[#444]! rounded!"
            />
            Case Sensitive
          </label>
        </div>
      )}

      {/* Configuration Summary */}
      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <h4 className="text-xs! font-semibold! text-[#e0e0e0]! mb-2!">
          Condition Summary
        </h4>
        <div className="text-xs! text-[#999999]! font-mono!">
          <span className="text-[#85409D]!">{leftValue || '(left value)'}</span>
          {' '}
          <span className="text-[#e0e0e0]!">{operator}</span>
          {' '}
          {needsRightValue && (
            <span className="text-[#85409D]!">{rightValue || '(right value)'}</span>
          )}
        </div>
        <p className="text-xs! text-[#666666]! mt-2!">
          If this condition is <strong className="text-green-400!">true</strong>, the workflow follows the green branch.
          Otherwise, it follows the <strong className="text-red-400!">red</strong> branch.
        </p>
      </div>

      {/* Examples */}
      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <h4 className="text-xs! font-semibold! text-[#85409D]! mb-2!">
          Examples
        </h4>
        <div className="space-y-1! text-xs! text-[#999999]!">
          <div>• <code className="text-[#85409D]!">trigger.status == "active"</code></div>
          <div>• <code className="text-[#85409D]!">previousAction.count {'>'} 100</code></div>
          <div>• <code className="text-[#85409D]!">workflow.email contains "@gmail.com"</code></div>
        </div>
      </div>
    </div>
  )
}

CompareCondition.defaultConfig = {
  leftValue: '',
  leftType: 'variable',
  leftTriggerId: '',
  leftTriggerField: '',
  operator: '==',
  rightValue: '',
  rightType: 'string',
  rightTriggerId: '',
  rightTriggerField: '',
  caseSensitive: true
}
