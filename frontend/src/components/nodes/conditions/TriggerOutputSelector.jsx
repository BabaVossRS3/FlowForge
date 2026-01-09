import { useState, useEffect } from 'react'
import { ChevronDown, Zap } from 'lucide-react'
import { useTriggerOutputs } from '../../../context/TriggerOutputContext'

export default function TriggerOutputSelector({ onSelect, selectedTriggerId, selectedField }) {
  const { getAllTriggerOutputs } = useTriggerOutputs()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedTrigger, setSelectedTrigger] = useState(selectedTriggerId || '')
  const [selectedFieldPath, setSelectedFieldPath] = useState(selectedField || '')

  const triggerOutputs = getAllTriggerOutputs()
  const triggerIds = Object.keys(triggerOutputs)

  const currentTriggerSchema = selectedTrigger ? triggerOutputs[selectedTrigger] : null
  const availableFields = currentTriggerSchema?.fields || []

  const handleTriggerSelect = (triggerId) => {
    setSelectedTrigger(triggerId)
    setSelectedFieldPath('')
    onSelect(triggerId, '')
  }

  const handleFieldSelect = (fieldPath) => {
    setSelectedFieldPath(fieldPath)
    onSelect(selectedTrigger, fieldPath)
  }

  const getDisplayLabel = () => {
    if (!selectedTrigger) return 'Select trigger output...'
    if (!selectedFieldPath) return `Trigger: ${selectedTrigger}`
    return `${selectedTrigger}.${selectedFieldPath}`
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full! bg-[#2a2a3e]! border! border-[#85409D]/50! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! flex! items-center! justify-between! hover:border-[#85409D]! transition!"
      >
        <div className="flex! items-center! gap-2!">
          <Zap size={14} className="text-[#85409D]!" />
          <span className="truncate!">{getDisplayLabel()}</span>
        </div>
        <ChevronDown size={16} className={`transition! ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute! top-full! left-0! right-0! mt-1! bg-[#1a1a2e]! border! border-[#85409D]/50! rounded! shadow-lg! z-50!">
          {triggerIds.length === 0 ? (
            <div className="p-3! text-xs! text-[#666666]!">
              No triggers found in workflow. Add a trigger first.
            </div>
          ) : (
            <>
              <div className="border-b! border-[#444]!">
                <div className="p-2!">
                  <p className="text-xs! text-[#999999]! font-semibold! px-2! py-1!">
                    Triggers
                  </p>
                  {triggerIds.map(triggerId => (
                    <button
                      key={triggerId}
                      onClick={() => handleTriggerSelect(triggerId)}
                      className={`w-full! text-left! px-3! py-2! text-sm! rounded! transition! ${
                        selectedTrigger === triggerId
                          ? 'bg-[#85409D]/30! text-[#85409D]!'
                          : 'text-[#e0e0e0]! hover:bg-[#2a2a3e]!'
                      }`}
                    >
                      <Zap size={12} className="inline! mr-2!" />
                      {triggerId}
                    </button>
                  ))}
                </div>
              </div>

              {selectedTrigger && availableFields.length > 0 && (
                <div className="p-2!">
                  <p className="text-xs! text-[#999999]! font-semibold! px-2! py-1!">
                    Available Fields
                  </p>
                  {availableFields.map(field => (
                    <button
                      key={field.path}
                      onClick={() => handleFieldSelect(field.path)}
                      className={`w-full! text-left! px-3! py-2! text-sm! rounded! transition! ${
                        selectedFieldPath === field.path
                          ? 'bg-[#85409D]/30! text-[#85409D]!'
                          : 'text-[#e0e0e0]! hover:bg-[#2a2a3e]!'
                      }`}
                    >
                      <div className="flex! items-center! justify-between!">
                        <div>
                          <div className="font-mono! text-xs!">{field.path}</div>
                          {field.description && (
                            <div className="text-xs! text-[#666666]!">{field.description}</div>
                          )}
                        </div>
                        <span className="text-xs! text-[#999999]! bg-[#2a2a3e]! px-2! py-1! rounded!">
                          {field.type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {selectedTrigger && selectedFieldPath && (
        <div className="mt-2! bg-[#1a1a2e]! rounded! p-2! border! border-[#85409D]/30!">
          <p className="text-xs! text-[#999999]!">
            <strong className="text-[#85409D]!">Selected:</strong> {selectedTrigger}.{selectedFieldPath}
          </p>
        </div>
      )}
    </div>
  )
}
