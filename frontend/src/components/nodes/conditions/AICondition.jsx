import { useState, useEffect } from 'react'
import { Sparkles, AlertCircle } from 'lucide-react'

const aiConditionTypes = [
  { 
    value: 'custom', 
    label: 'Custom AI Evaluation',
    description: 'Write your own evaluation criteria'
  },
  { 
    value: 'sentiment', 
    label: 'Sentiment Analysis',
    description: 'Evaluate if message sentiment is positive'
  },
  { 
    value: 'approval', 
    label: 'Approval Detection',
    description: 'Check if message indicates approval'
  },
  { 
    value: 'complaint', 
    label: 'Complaint Detection',
    description: 'Check if message indicates a complaint'
  },
]

const defaultPrompts = {
  sentiment: 'Analyze the sentiment of this message. Is it positive (satisfied, happy, pleased, grateful, approving)? Answer ONLY with the word "true" if positive, or "false" if negative/neutral.',
  approval: 'Does this message indicate approval, agreement, acceptance, or positive response (yes, approved, agreed, confirmed)? Answer ONLY with the word "true" if yes, or "false" if no.',
  complaint: 'Does this message indicate a complaint, issue, dissatisfaction, or negative feedback (angry, upset, problem, issue)? Answer ONLY with the word "true" if yes, or "false" if no.',
  custom: 'Evaluate this message based on your criteria. Answer ONLY with the word "true" or "false". No other text.'
}

export default function AICondition({ config, onChange }) {
  const [aiType, setAiType] = useState(config.aiType || 'sentiment')
  const [prompt, setPrompt] = useState(config.prompt || defaultPrompts.sentiment)
  const [useCustomPrompt, setUseCustomPrompt] = useState(!!config.prompt && !defaultPrompts[config.aiType])

  useEffect(() => {
    onChange({
      aiType,
      prompt,
      useCustomPrompt
    })
  }, [aiType, prompt, useCustomPrompt])

  const handleTypeChange = (newType) => {
    setAiType(newType)
    if (!useCustomPrompt) {
      setPrompt(defaultPrompts[newType] || defaultPrompts.custom)
    }
  }

  const handlePromptChange = (newPrompt) => {
    setPrompt(newPrompt)
  }

  const selectedType = aiConditionTypes.find(t => t.value === aiType)

  return (
    <div className="space-y-4!">
      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <div className="flex! items-center! gap-2! mb-2!">
          <Sparkles size={16} className="text-[#85409D]!" />
          <h4 className="text-sm! font-semibold! text-[#e0e0e0]!">
            AI-Powered Condition
          </h4>
        </div>
        <p className="text-xs! text-[#999999]!">
          Use AI to intelligently evaluate the trigger message and determine if the condition is true or false.
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Evaluation Type
        </label>
        <select
          value={aiType}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {aiConditionTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {selectedType && (
          <p className="text-xs! text-[#666666]! mt-1!">
            {selectedType.description}
          </p>
        )}
      </div>

      <div>
        <div className="flex! items-center! justify-between! mb-2!">
          <label className="block! text-sm! text-[#999999]!">
            Evaluation Prompt
          </label>
          <label className="flex! items-center! gap-2! text-xs! text-[#999999]! cursor-pointer!">
            <input
              type="checkbox"
              checked={useCustomPrompt}
              onChange={(e) => setUseCustomPrompt(e.target.checked)}
              className="bg-[#2a2a3e]! border-[#444]! rounded!"
            />
            Custom Prompt
          </label>
        </div>
        
        {!useCustomPrompt && (
          <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30! mb-2!">
            <p className="text-xs! text-[#999999]! font-mono!">
              {defaultPrompts[aiType] || defaultPrompts.custom}
            </p>
          </div>
        )}

        {useCustomPrompt && (
          <textarea
            value={prompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            placeholder="Write your evaluation criteria. The message will be appended. Respond with only 'true' or 'false'."
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! font-mono! h-24! resize-none!"
          />
        )}
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <div className="flex! gap-2! mb-2!">
          <AlertCircle size={14} className="text-[#85409D]! shrink-0! mt-0.5!" />
          <div>
            <h4 className="text-xs! font-semibold! text-[#85409D]! mb-1!">
              How It Works
            </h4>
            <ul className="text-xs! text-[#999999]! space-y-1!">
              <li>• AI reads the incoming message from the trigger</li>
              <li>• AI evaluates it based on your prompt</li>
              <li>• Returns "true" or "false"</li>
              <li>• True branch executes if positive, false branch if negative</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <h4 className="text-xs! font-semibold! text-[#85409D]! mb-2!">
          Example Use Cases
        </h4>
        <div className="space-y-2! text-xs! text-[#999999]!">
          <div>
            <strong className="text-[#e0e0e0]!">Approval Detection:</strong>
            <p>If customer says "yes" or "approved", send confirmation email. Otherwise, send follow-up.</p>
          </div>
          <div>
            <strong className="text-[#e0e0e0]!">Complaint Detection:</strong>
            <p>If customer complains, escalate to support. Otherwise, send thank you email.</p>
          </div>
          <div>
            <strong className="text-[#e0e0e0]!">Sentiment Analysis:</strong>
            <p>If message is positive, add to newsletter. If negative, flag for review.</p>
          </div>
        </div>
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <p className="text-xs! text-[#999999]!">
          <strong className="text-[#85409D]!">Note:</strong> Uses Google Gemini AI (free). Configure GEMINI_API_KEY in backend environment variables. Set AI_PROVIDER=gemini (default).
        </p>
      </div>
    </div>
  )
}

AICondition.defaultConfig = {
  aiType: 'custom',
  prompt: defaultPrompts.custom,
  useCustomPrompt: false
}
