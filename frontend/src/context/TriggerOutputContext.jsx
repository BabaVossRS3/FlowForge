import { createContext, useContext, useState, useCallback } from 'react'

const TriggerOutputContext = createContext()

export function TriggerOutputProvider({ children }) {
  const [triggerOutputs, setTriggerOutputs] = useState({})

  const registerTriggerOutput = useCallback((triggerId, outputSchema) => {
    setTriggerOutputs(prev => ({
      ...prev,
      [triggerId]: outputSchema
    }))
  }, [])

  const getTriggerOutput = useCallback((triggerId) => {
    return triggerOutputs[triggerId]
  }, [triggerOutputs])

  const getAllTriggerOutputs = useCallback(() => {
    return triggerOutputs
  }, [triggerOutputs])

  const removeTriggerOutput = useCallback((triggerId) => {
    setTriggerOutputs(prev => {
      const newOutputs = { ...prev }
      delete newOutputs[triggerId]
      return newOutputs
    })
  }, [])

  return (
    <TriggerOutputContext.Provider
      value={{
        triggerOutputs,
        registerTriggerOutput,
        getTriggerOutput,
        getAllTriggerOutputs,
        removeTriggerOutput,
      }}
    >
      {children}
    </TriggerOutputContext.Provider>
  )
}

export function useTriggerOutputs() {
  const context = useContext(TriggerOutputContext)
  if (!context) {
    throw new Error('useTriggerOutputs must be used within TriggerOutputProvider')
  }
  return context
}
