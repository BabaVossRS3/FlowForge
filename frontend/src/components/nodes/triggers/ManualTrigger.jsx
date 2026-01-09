import { Info } from 'lucide-react'

export default function ManualTrigger({ config, onChange }) {
  return (
    <div className="bg-[#2a2a3e]! rounded! p-4! border! border-[#444]!">
      <div className="flex! items-start! gap-3!">
        <Info size={20} className="text-[#85409D]! mt-0.5! shrink-0!" />
        <div>
          <h4 className="text-sm! font-semibold! text-[#e0e0e0]! mb-1!">
            Manual Trigger
          </h4>
          <p className="text-xs! text-[#999999]! leading-relaxed!">
            This workflow will only execute when you manually trigger it using the "Execute" button in the sidebar or canvas header.
          </p>
        </div>
      </div>
    </div>
  )
}

ManualTrigger.defaultConfig = {
  description: 'Trigger workflow manually'
}
