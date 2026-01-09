import { useState, useEffect } from 'react'
import { useDrag } from 'react-dnd'
import { Zap, Database, Mail, Filter, GripHorizontal } from 'lucide-react'

const nodeTypes = [
  { type: 'trigger', label: 'Trigger', icon: Zap, color: '#85409D' },
  { type: 'action', label: 'Action', icon: Database, color: '#b366ff' },
  { type: 'condition', label: 'Condition', icon: Filter, color: '#a855f7' },
  { type: 'notification', label: 'Notification', icon: Mail, color: '#d946ef' },
]

function DraggableNode({ nodeType, isDisabled }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'node',
    item: { type: nodeType.type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [isDisabled])

  const Icon = nodeType.icon

  return (
    <div
      ref={isDisabled ? null : drag}
      className={`p-3! bg-[#2a2a3e]! border! border-[#85409D]! rounded! transition-all! flex! items-center! gap-2! group! ${
        isDisabled ? 'opacity-20! cursor-not-allowed!' : 'hover:bg-[#3a3a4e]! cursor-move!'
      } ${
        isDragging ? 'opacity-50! scale-95!' : 'opacity-100!'
      }`}
    >
      <Icon size={16} style={{ color: nodeType.color }} className={isDisabled ? '' : 'group-hover:scale-110! transition-transform!'} />
      <span className={`text-sm! ${isDisabled ? 'text-[#666666]!' : 'text-[#e0e0e0]!'}`}>{nodeType.label}</span>
    </div>
  )
}

export default function NodeToolbar({ nodeCount = 0 }) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDraggingBar, setIsDraggingBar] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [showHint, setShowHint] = useState(false)


  useEffect(() => {
    // Set initial position to right side, middle of screen
    const setInitialPosition = () => {
      setPosition({
        x: window.innerWidth - 220,
        y: window.innerHeight / 2 - 150,
      })
    }

    setInitialPosition()
    window.addEventListener('resize', setInitialPosition)

    // Show hint after 1 second
    const hintTimer = setTimeout(() => {
      setShowHint(true)
    }, 1000)

    // Hide hint after 4 seconds
    const hideTimer = setTimeout(() => {
      setShowHint(false)
    }, 5000)

    return () => {
      window.removeEventListener('resize', setInitialPosition)
      clearTimeout(hintTimer)
      clearTimeout(hideTimer)
    }
  }, [])

  const handleMouseDown = (e) => {
    setIsDraggingBar(true)
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e) => {
    if (isDraggingBar) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDraggingBar(false)
  }

  return (
    <div
      className="fixed! bg-[#1a1a2e]! border! border-[#85409D]! rounded-lg! p-4! w-48! shadow-lg! z-50! select-none!"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDraggingBar ? 'grabbing' : 'grab',
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="flex! items-center! gap-2! mb-3! cursor-grab! active:cursor-grabbing! relative!"
        onMouseDown={handleMouseDown}
      >
        <GripHorizontal size={16} className="text-[#85409D]!" />
        <h3 className="text-sm! font-semibold! text-[#85409D]! uppercase! tracking-wide! flex-1!">Nodes</h3>
        {showHint && (
          <div className="absolute! bottom-full! right-0! mb-2! bg-[#85409D]! text-white! text-xs! px-2! py-1! rounded! whitespace-nowrap! animate-fade-in!">
            Drag to move
          </div>
        )}
      </div>
      <div className="space-y-2!">
        {nodeTypes.map((node) => (
          <DraggableNode key={node.type} nodeType={node} isDisabled={nodeCount === 0 && node.type !== 'trigger'} />
        ))}
      </div>
      <p className="text-xs! text-[#666666]! mt-4!">
        {nodeCount === 0 ? 'Add a Trigger first' : 'Drag nodes to canvas'}
      </p>
    </div>
  )
}
