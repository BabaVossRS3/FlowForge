import { useState, useEffect } from 'react'
import { Code, Wand2 } from 'lucide-react'

const transformTypes = [
  { value: 'javascript', label: 'JavaScript Function' },
  { value: 'jsonPath', label: 'JSON Path Extraction' },
  { value: 'template', label: 'Template String' },
  { value: 'filter', label: 'Filter Array' },
  { value: 'map', label: 'Map Array' },
]

const examples = {
  javascript: `// Transform input data
function transform(input) {
  return {
    fullName: input.firstName + ' ' + input.lastName,
    email: input.email.toLowerCase(),
    timestamp: new Date().toISOString()
  }
}`,
  jsonPath: `// Extract specific fields from nested JSON
$.user.profile.email
$.orders[*].total
$.data.items[?(@.status == 'active')]`,
  template: '// Use {{variable}} syntax to build strings\nHello {{user.name}},\nYour order #{{order.id}} has been {{order.status}}.\nTotal: ${{order.total}}',
  filter: `// Filter array items based on condition
item.status === 'active' && item.price > 100`,
  map: `// Transform each item in array
{
  id: item.id,
  name: item.name.toUpperCase(),
  price: item.price * 1.1
}`
}

export default function DataTransformAction({ config, onChange }) {
  const [transformType, setTransformType] = useState(config.transformType || 'javascript')
  const [script, setScript] = useState(config.script || examples.javascript)
  const [inputPath, setInputPath] = useState(config.inputPath || 'data')
  const [outputPath, setOutputPath] = useState(config.outputPath || 'result')

  useEffect(() => {
    onChange({
      transformType,
      script,
      inputPath,
      outputPath,
    })
  }, [transformType, script, inputPath, outputPath])

  const handleTypeChange = (newType) => {
    setTransformType(newType)
    setScript(examples[newType] || '')
  }

  return (
    <div className="space-y-3!">
      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          <Wand2 size={14} className="inline! mr-1!" />
          Transform Type
        </label>
        <select
          value={transformType}
          onChange={(e) => handleTypeChange(e.target.value)}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        >
          {transformTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid! grid-cols-2! gap-3!">
        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Input Path
          </label>
          <input
            type="text"
            value={inputPath}
            onChange={(e) => setInputPath(e.target.value)}
            placeholder="data"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          />
          <p className="text-xs! text-[#666666]! mt-1!">
            Path to input data in workflow context
          </p>
        </div>

        <div>
          <label className="block! text-sm! text-[#999999]! mb-2!">
            Output Path
          </label>
          <input
            type="text"
            value={outputPath}
            onChange={(e) => setOutputPath(e.target.value)}
            placeholder="result"
            className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
          />
          <p className="text-xs! text-[#666666]! mt-1!">
            Where to store transformed data
          </p>
        </div>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          <Code size={14} className="inline! mr-1!" />
          {transformType === 'javascript' && 'JavaScript Code'}
          {transformType === 'jsonPath' && 'JSON Path Expression'}
          {transformType === 'template' && 'Template String'}
          {transformType === 'filter' && 'Filter Condition'}
          {transformType === 'map' && 'Map Expression'}
        </label>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          placeholder={examples[transformType]}
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! font-mono! h-48!"
        />
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <h4 className="text-xs! font-semibold! text-[#e0e0e0]! mb-2!">
          How it works
        </h4>
        <p className="text-xs! text-[#999999]! leading-relaxed!">
          {transformType === 'javascript' && 'Execute custom JavaScript to transform data. The function receives input data and should return the transformed result.'}
          {transformType === 'jsonPath' && 'Extract specific fields from JSON using JSONPath syntax. Supports wildcards, filters, and nested paths.'}
          {transformType === 'template' && 'Build strings using template syntax. Use {{path.to.variable}} to insert values from the workflow context.'}
          {transformType === 'filter' && 'Filter array items based on a condition. Each item is available as "item" in the expression.'}
          {transformType === 'map' && 'Transform each item in an array. Each item is available as "item" in the expression.'}
        </p>
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <h4 className="text-xs! font-semibold! text-[#e0e0e0]! mb-2!">
          Configuration Summary
        </h4>
        <p className="text-xs! text-[#999999]!">
          Apply <strong className="text-[#85409D]!">{transformTypes.find(t => t.value === transformType)?.label}</strong> to{' '}
          <strong className="text-[#85409D]!">{inputPath}</strong> and store result in{' '}
          <strong className="text-[#85409D]!">{outputPath}</strong>
        </p>
      </div>
    </div>
  )
}

DataTransformAction.defaultConfig = {
  transformType: 'javascript',
  script: examples.javascript,
  inputPath: 'data',
  outputPath: 'result'
}
