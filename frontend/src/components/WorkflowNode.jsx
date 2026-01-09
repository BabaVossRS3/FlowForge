import { Handle, Position, useReactFlow } from 'reactflow'
import { Zap, Database, Filter, Mail, Settings, Trash2 } from 'lucide-react'
import { useState } from 'react'
import AIValidationTooltip from './AIValidationTooltip'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const nodeIcons = {
  trigger: Zap,
  action: Database,
  condition: Filter,
  notification: Mail,
}

const nodeColors = {
  trigger: '#85409D',
  action: '#b366ff',
  condition: '#a855f7',
  notification: '#d946ef',
}

export default function WorkflowNode({ data, id, selected, isConnecting }) {
  const [showConfig, setShowConfig] = useState(data.type === 'trigger')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { deleteElements } = useReactFlow()
  const Icon = nodeIcons[data.type] || Database

  const validation = data?.__validation
  
  // Debug: log when validation is received
  if (validation && validation.issues?.length > 0) {
    console.log(`Node ${id} has validation issues:`, validation.issues.filter(i => i.nodeId === id));
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation()
    setShowDeleteDialog(true)
  }

  const confirmDelete = () => {
    deleteElements({ nodes: [{ id }] })
    setShowDeleteDialog(false)
  }

  return (
    <div
      className={`px-4! py-3! rounded-lg! border-2! transition-all! relative! ${
        selected
          ? 'border-[#b366ff]! shadow-lg! shadow-[#85409D]/50!'
          : 'border-[#85409D]!'
      } bg-[#1a1a2e]! min-w-[180px]!`}
      style={{
        borderColor: selected ? '#b366ff' : nodeColors[data.type],
      }}
    >
      {validation && <AIValidationTooltip nodeId={id} validation={validation} />}
      <div className="flex! items-center! justify-between! mb-2!">
        <div className="flex! items-center! gap-2!">
          <Icon size={16} style={{ color: nodeColors[data.type] }} />
          <span className="text-sm! font-semibold! text-[#e0e0e0]!">{data.label}</span>
        </div>
        <div className="flex! items-center! gap-1!">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowConfig(!showConfig)
            }}
            className="p-1! hover:bg-[#2a2a3e]! rounded! transition-colors!"
            title="Configure node"
          >
            <Settings size={14} className="text-[#999999]!" />
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1! hover:bg-[#2a2a3e]! rounded! transition-colors!"
            title="Delete node"
          >
            <Trash2 size={14} className="text-white!" />
          </button>
        </div>
      </div>

      {data.description && (
        <p className="text-xs! text-[#666666]! mb-2!">{data.description}</p>
      )}

      {showConfig && data.config && (
        <div className="bg-[#0a0a0a]! rounded! p-3! mb-2! text-xs! max-w-sm! leading-relaxed!">
          {Object.entries(data.config).map(([key, value]) => {
            const formatLabel = (str) => {
              return str
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (char) => char.toUpperCase())
                .trim()
            }

            let displayValue = value
            let isNested = false
            if (typeof value === 'object' && value !== null) {
              isNested = true
              displayValue = Object.entries(value)
                .map(([k, v]) => `${formatLabel(k)}: ${v}`)
                .join(' • ')
            }
            return (
              <div key={key} className="block!">
                <span className="text-[#85409D]! font-semibold!">{formatLabel(key)}:</span> <span className={isNested ? 'text-[#666666]!' : 'text-[#e0e0e0]!'}>{displayValue}</span>
                <br />
              </div>
            )
          })}
        </div>
      )}

      <Handle type="target" position={Position.Left} />
      
      {data.type === 'condition' ? (
        <>
          {/* True branch (top) */}
          <Handle 
            type="source" 
            position={Position.Right} 
            id="true"
            style={{ 
              top: '30%', 
              background: '#ffffff',
              width: '12px',
              height: '12px',
              border: '2px solid #85409D',
              cursor: 'crosshair'
            }}
            isConnectable={true}
          />
          <div 
            className="absolute! right-[-45px]! text-xs! font-semibold! text-[#e0e0e0]!"
            style={{ top: 'calc(30% - 8px)', pointerEvents: 'none' }}
          >
            True
          </div>
          
          {/* False branch (bottom) */}
          <Handle 
            type="source" 
            position={Position.Right} 
            id="false"
            style={{ 
              top: '70%', 
              background: '#ffffff',
              width: '12px',
              height: '12px',
              border: '2px solid #85409D',
              cursor: 'crosshair'
            }}
            isConnectable={true}
          />
          <div 
            className="absolute! right-[-50px]! text-xs! font-semibold! text-[#e0e0e0]!"
            style={{ top: 'calc(70% - 8px)', pointerEvents: 'none' }}
          >
            False
          </div>
        </>
      ) : (
        <Handle type="source" position={Position.Right} />
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#1a1a2e]! p-4! border-[#85409D]! border-2!">
          <AlertDialogHeader className="gap-2!">
            <AlertDialogTitle className="text-[#e0e0e0]! text-lg! font-semibold!">Delete Node</AlertDialogTitle>
            <AlertDialogDescription className="text-[#999999]! text-sm!">
              Are you sure you want to delete this node? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex! gap-3! justify-end! flex-row!">
            <AlertDialogCancel className="bg-[#2a2a3e]! text-[#e0e0e0]! border-[#85409D]! border! hover:bg-[#3a3a4e]! px-4! py-2! rounded!">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600! hover:bg-red-700! text-white! px-4! py-2! rounded!">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
