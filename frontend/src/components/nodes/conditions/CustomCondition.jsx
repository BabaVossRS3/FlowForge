import { useState, useEffect } from 'react'
import { Code, Lightbulb } from 'lucide-react'

const examples = [
  {
    title: 'Number Range Check',
    code: 'trigger.age >= 18 && trigger.age <= 65'
  },
  {
    title: 'String Pattern Match',
    code: 'trigger.email.endsWith("@company.com") && trigger.department === "engineering"'
  },
  {
    title: 'Array Contains',
    code: 'trigger.tags.includes("premium") || trigger.tags.includes("vip")'
  },
  {
    title: 'Complex Logic',
    code: '(trigger.status === "active" && trigger.balance > 0) || trigger.role === "admin"'
  },
  {
    title: 'Date Comparison',
    code: 'new Date(trigger.expiryDate) > new Date()'
  },
]

export default function CustomCondition({ config, onChange }) {
  const [expression, setExpression] = useState(config.expression || '')
  const [description, setDescription] = useState(config.description || '')

  useEffect(() => {
    onChange({
      expression,
      description,
    })
  }, [expression, description])

  const loadExample = (exampleCode) => {
    setExpression(exampleCode)
  }

  return (
    <div className="space-y-3!">
      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <div className="flex! items-center! gap-2! mb-2!">
          <Code size={16} className="text-[#85409D]!" />
          <h4 className="text-sm! font-semibold! text-[#e0e0e0]!">
            JavaScript Expression
          </h4>
        </div>
        <p className="text-xs! text-[#999999]!">
          Write a JavaScript expression that evaluates to true or false. You have access to all workflow context variables.
        </p>
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Description (Optional)
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does this condition check?"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm!"
        />
      </div>

      <div>
        <label className="block! text-sm! text-[#999999]! mb-2!">
          Condition Expression
        </label>
        <textarea
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="trigger.status === 'active' && trigger.balance > 100"
          className="w-full! bg-[#2a2a3e]! border-none! rounded! px-3! py-2! text-[#e0e0e0]! text-sm! font-mono! h-32!"
        />
        <p className="text-xs! text-[#666666]! mt-1!">
          Expression must return a boolean (true/false)
        </p>
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <h4 className="text-xs! font-semibold! text-[#e0e0e0]! mb-2!">
          Available Context
        </h4>
        <div className="space-y-1! text-xs! text-[#999999]!">
          <div>• <code className="text-[#85409D]!">trigger.*</code> - Data from the trigger</div>
          <div>• <code className="text-[#85409D]!">previousAction.*</code> - Output from previous action</div>
          <div>• <code className="text-[#85409D]!">workflow.*</code> - Workflow variables</div>
          <div>• <code className="text-[#85409D]!">Math.*</code> - Math functions</div>
          <div>• <code className="text-[#85409D]!">Date</code> - Date constructor</div>
        </div>
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-[#85409D]/30!">
        <div className="flex! items-center! gap-2! mb-2!">
          <Lightbulb size={14} className="text-[#85409D]!" />
          <h4 className="text-xs! font-semibold! text-[#85409D]!">
            Example Expressions
          </h4>
        </div>
        <div className="space-y-2!">
          {examples.map((example, index) => (
            <div key={index} className="bg-[#2a2a3e]! rounded! p-2!">
              <div className="flex! items-center! justify-between! mb-1!">
                <span className="text-xs! font-semibold! text-[#e0e0e0]!">
                  {example.title}
                </span>
                <button
                  onClick={() => loadExample(example.code)}
                  className="text-xs! text-[#85409D]! hover:text-[#a855f7]! transition-colors!"
                >
                  Use
                </button>
              </div>
              <code className="text-xs! text-[#999999]! block! overflow-x-auto!">
                {example.code}
              </code>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#2a2a3e]! rounded! p-3! border! border-[#444]!">
        <h4 className="text-xs! font-semibold! text-[#e0e0e0]! mb-2!">
          Condition Summary
        </h4>
        {description ? (
          <p className="text-xs! text-[#999999]! mb-2!">{description}</p>
        ) : null}
        <div className="text-xs! text-[#999999]! font-mono! bg-[#1a1a2e]! p-2! rounded!">
          {expression || '(no expression set)'}
        </div>
        <p className="text-xs! text-[#666666]! mt-2!">
          If this expression evaluates to <strong className="text-green-400!">true</strong>, the green branch is taken.
          Otherwise, the <strong className="text-red-400!">red</strong> branch is taken.
        </p>
      </div>

      <div className="bg-[#1a1a2e]! rounded! p-3! border! border-yellow-600/30!">
        <p className="text-xs! text-[#999999]!">
          <strong className="text-yellow-500!">Security:</strong> Custom expressions are executed in a sandboxed environment with limited access to prevent security issues.
        </p>
      </div>
    </div>
  )
}

CustomCondition.defaultConfig = {
  expression: '',
  description: ''
}
