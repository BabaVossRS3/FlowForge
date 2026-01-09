import { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'

const transformationTypes = [
  { value: 'extract', label: 'Extract Information', description: 'Extract specific data from message' },
  { value: 'summarize', label: 'Summarize', description: 'Create a concise summary' },
  { value: 'categorize', label: 'Categorize', description: 'Classify into categories' },
  { value: 'translate', label: 'Translate', description: 'Translate to another language' },
  { value: 'format', label: 'Format Data', description: 'Reformat data structure' },
  { value: 'custom', label: 'Custom Transform', description: 'Define your own transformation' },
]

export default function AIDataTransformAction({ config, onChange }) {
  const [transformType, setTransformType] = useState(config.transformType || 'extract')
  const [customPrompt, setCustomPrompt] = useState(config.customPrompt || '')
  const [outputFormat, setOutputFormat] = useState(config.outputFormat || 'json')
  const [storeResult, setStoreResult] = useState(config.storeResult !== false)
  const [resultVariableName, setResultVariableName] = useState(config.resultVariableName || 'transformedData')

  useEffect(() => {
    onChange({
      transformType,
      customPrompt,
      outputFormat,
      storeResult,
      resultVariableName
    })
  }, [transformType, customPrompt, outputFormat, storeResult, resultVariableName])

  const selectedType = transformationTypes.find(t => t.value === transformType)

  return (
    <div className="space-y-4!">
      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <div className="flex! items-center! gap-2! mb-2!">
          <Sparkles size={16} className="text-[#85409D]!" />
          <h4 className="text-sm! font-semibold! text-[#e0e0e0]!">
            AI Data Transformation
          </h4>
        </div>
        <p className="text-xs! text-[#999999]!">
          Use AI to intelligently extract, transform, and structure data from messages.
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Transformation Type
        </label>
        <select
          value={transformType}
          onChange={(e) => setTransformType(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {transformationTypes.map((type) => (
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

      {transformType === 'custom' && (
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Custom Transformation Prompt
          </label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Describe how to transform the data. E.g., 'Extract the customer name, email, and order number'"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! h-20! resize-none!"
          />
        </div>
      )}

      {transformType !== 'custom' && (
        <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
          <p className="text-xs! text-[#999999]!">
            <strong className="text-[#85409D]!">Transformation:</strong> {selectedType?.description}
          </p>
        </div>
      )}

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Output Format
        </label>
        <select
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          <option value="json">JSON</option>
          <option value="text">Plain Text</option>
          <option value="csv">CSV</option>
          <option value="array">Array</option>
        </select>
      </div>

      <div>
        <label className="flex! items-center! gap-2! text-sm! text-[#999999]! cursor-pointer!">
          <input
            type="checkbox"
            checked={storeResult}
            onChange={(e) => setStoreResult(e.target.checked)}
            className="bg-[#2a2a3e]! border-[#444]! rounded!"
          />
          Store Result for Later Use
        </label>
      </div>

      {storeResult && (
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Variable Name
          </label>
          <input
            type="text"
            value={resultVariableName}
            onChange={(e) => setResultVariableName(e.target.value)}
            placeholder="transformedData"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          />
          <p className="text-xs! text-[#666666]! mt-1!">
            Use this name in conditions: workflow.{resultVariableName}
          </p>
        </div>
      )}

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <h4 className="text-xs! font-semibold! text-[#85409D]! mb-2!">
          Examples
        </h4>
        <div className="space-y-2! text-xs! text-[#999999]!">
          <div>
            <strong className="text-[#e0e0e0]!">Extract:</strong>
            <p>Extract name, email, phone from customer message</p>
          </div>
          <div>
            <strong className="text-[#e0e0e0]!">Summarize:</strong>
            <p>Create 2-sentence summary of customer feedback</p>
          </div>
          <div>
            <strong className="text-[#e0e0e0]!">Categorize:</strong>
            <p>Classify issue as: bug, feature request, or support</p>
          </div>
        </div>
      </div>
    </div>
  )
}

AIDataTransformAction.defaultConfig = {
  transformType: 'extract',
  customPrompt: '',
  outputFormat: 'json',
  storeResult: true,
  resultVariableName: 'transformedData'
}
