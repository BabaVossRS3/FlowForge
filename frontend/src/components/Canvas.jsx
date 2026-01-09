import { useCallback, useState, useRef, useEffect, useMemo, useContext } from 'react'
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useDrop } from 'react-dnd'
import { AuthContext } from '../context/AuthContext'
import { getWorkflowsAPI } from '../lib/api'
import DotGrid from './DotGrid'
import NodeToolbar from './NodeToolbar'
import WorkflowNode from './WorkflowNode'
import NodeConfig from './NodeConfig'
import AIAssistant from './AIAssistant'
import { useAIValidation } from '../hooks/useAIValidation'
import { Play, Loader, Check, Sparkles, Power } from 'lucide-react'
import { toast } from 'sonner'
import 'react-tooltip/dist/react-tooltip.css'


// Define nodeTypes outside component to keep object identity stable (React Flow warning #002)
const nodeTypes = {
  trigger: WorkflowNode,
  action: WorkflowNode,
  condition: WorkflowNode,
  notification: WorkflowNode,
}


export default function Canvas({ workflows, setWorkflows, activeWorkflow, setActiveWorkflow }) {
  const { token } = useContext(AuthContext)
  const api = getWorkflowsAPI(token)
  const [nodes, setNodes, onNodesChange] = useNodesState([])
  const [edges, setEdges, onEdgesChange] = useEdgesState([])
  const [saving, setSaving] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [activating, setActivating] = useState(false)
  const [selectedNode, setSelectedNode] = useState(null)
  const [showNodeConfig, setShowNodeConfig] = useState(false)
  const [showSaveIndicator, setShowSaveIndicator] = useState(false)
  const reactFlowWrapper = useRef(null)
  const [reactFlowInstance, setReactFlowInstance] = useState(null)
  const autoSaveTimerRef = useRef(null)
  const lastSavedStateRef = useRef(null)
  const workflowsRef = useRef(workflows)
  const setWorkflowsRef = useRef(setWorkflows)
  
  const { validation, validating, validateWorkflow } = useAIValidation(nodes, edges, activeWorkflow)
  
  // Debug: log validation response
  if (validation) {
    console.log('Validation response:', validation);
  }

  const nodesWithValidation = useMemo(() => {
    if (!validation) return nodes
    return nodes.map((n) => ({
      ...n,
      data: {
        ...n.data,
        __validation: validation,
      },
    }))
  }, [nodes, validation])
  
  const workflowContext = useMemo(() => ({
    workflowId: activeWorkflow?._id,
    workflowName: activeWorkflow?.name,
    nodeCount: nodes.length,
    edgeCount: edges.length,
    nodes: nodes.map(n => ({ id: n.id, type: n.type, label: n.data?.label })),
  }), [activeWorkflow, nodes, edges])

  // Keep refs updated
  useEffect(() => {
    workflowsRef.current = workflows
    setWorkflowsRef.current = setWorkflows
  }, [workflows, setWorkflows])

  const performSave = useCallback(async (isManualSave = false) => {
    if (!activeWorkflow) return

    try {
      if (isManualSave) setSaving(true)
      const cleanNodes = nodes.map(node => ({
        id: node.id,
        type: node.type,
        label: node.data?.label,
        position: node.position,
        data: node.data,
      }))
      const cleanEdges = edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        sourceHandle: edge.sourceHandle,
        targetHandle: edge.targetHandle,
        label: edge.label,
        animated: edge.animated,
      }))
      const response = await api.update(activeWorkflow._id, {
        name: activeWorkflow.name,
        description: activeWorkflow.description,
        nodes: cleanNodes,
        edges: cleanEdges,
      })
      setActiveWorkflow(response.data)
      // Update local state with saved data to reflect changes immediately
      setNodes(response.data.nodes || [])
      setEdges(response.data.edges || [])
      // Update the workflows array so Sidebar has latest data
      setWorkflows(workflows.map(w => w._id === response.data._id ? response.data : w))
      // Show save indicator only for auto-save
      if (!isManualSave) {
        setShowSaveIndicator(true)
        setTimeout(() => setShowSaveIndicator(false), 1500)
      }
    } catch (error) {
      console.error('Error saving workflow:', error)
      console.error('Error response:', error.response?.data)
    } finally {
      if (isManualSave) setSaving(false)
    }
  }, [activeWorkflow, nodes, edges, workflows, setWorkflows])

  const saveWorkflow = useCallback(() => {
    performSave(true)
  }, [performSave])

  useEffect(() => {
    if (activeWorkflow && activeWorkflow.nodes && activeWorkflow.edges) {
      setNodes(activeWorkflow.nodes)
      const animatedEdges = activeWorkflow.edges.map(edge => ({
        ...edge,
        animated: true
      }))
      setEdges(animatedEdges)
      // Update lastSavedStateRef to prevent unnecessary autosave on load
      lastSavedStateRef.current = JSON.stringify({ nodes: activeWorkflow.nodes, edges: animatedEdges })
    }
  }, [activeWorkflow, setNodes, setEdges])

  useEffect(() => {
    if (!activeWorkflow) return

    // Check if state has actually changed
    const currentState = JSON.stringify({ nodes, edges })
    if (lastSavedStateRef.current === currentState) {
      return
    }

    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    // Set new timer - saves 1 second after last change
    autoSaveTimerRef.current = setTimeout(async () => {
      if (!activeWorkflow) return

      try {
        const cleanNodes = nodes.map(node => ({
          id: node.id,
          type: node.type,
          label: node.data?.label,
          position: node.position,
          data: node.data,
        }))
        const cleanEdges = edges.map(edge => ({
          id: edge.id,
          source: edge.source,
          target: edge.target,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
          label: edge.label,
          animated: edge.animated,
        }))
        const response = await api.update(activeWorkflow._id, {
          name: activeWorkflow.name,
          description: activeWorkflow.description,
          nodes: cleanNodes,
          edges: cleanEdges,
        })
        // Update last saved state
        lastSavedStateRef.current = JSON.stringify({ nodes: response.data.nodes, edges: response.data.edges })
        // Use ref to avoid triggering effect again
        setWorkflowsRef.current(workflowsRef.current.map(w => w._id === response.data._id ? response.data : w))
        // Show save indicator
        setShowSaveIndicator(true)
        setTimeout(() => setShowSaveIndicator(false), 1500)
      } catch (error) {
        console.error('Error auto-saving workflow:', error)
      }
    }, 1000)

    // Cleanup on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [nodes, edges, activeWorkflow])

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) => {
        const newEdge = {
          ...connection,
          label: connection.sourceHandle || undefined,
          animated: true,
        }
        return addEdge(newEdge, eds)
      })
    },
    [setEdges],
  )

  const onNodeClick = useCallback((event, node) => {
    // Don't open config if clicking on a button
    if (event.target.closest('button')) {
      return
    }
    const canonical = nodes.find((n) => n.id === node.id) || node
    setSelectedNode(canonical)
    setShowNodeConfig(true)
  }, [nodes])

  const onUpdateNode = (updatedNode) => {
    setNodes((nds) =>
      nds.map((n) => (n.id === updatedNode.id ? updatedNode : n))
    )
  }

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: 'node',
      drop: (item, monitor) => {
        const clientOffset = monitor.getClientOffset()
        const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()

        if (!reactFlowBounds || !clientOffset) return

        let position = {
          x: clientOffset.x - reactFlowBounds.left - 90,
          y: clientOffset.y - reactFlowBounds.top - 40,
        }

        // If reactFlowInstance is available, use screenToFlowPosition for better accuracy
        if (reactFlowInstance) {
          position = reactFlowInstance.screenToFlowPosition({
            x: clientOffset.x,
            y: clientOffset.y,
          })
        }

        const newNode = {
          id: `node-${Date.now()}`,
          data: {
            label: item.type.charAt(0).toUpperCase() + item.type.slice(1),
            type: item.type,
            description: `Configure this ${item.type}`,
            config: {},
          },
          position,
          type: item.type,
        }

        console.log('Creating node:', newNode)
        setNodes((nds) => {
          const updated = nds.concat(newNode)
          console.log('Updated nodes:', updated)
          return updated
        })
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    [reactFlowInstance, setNodes],
  )

  const executeWorkflow = async () => {
    if (!activeWorkflow || nodes.length === 0) return

    try {
      setExecuting(true)
      const response = await api.execute(activeWorkflow._id, {
        nodes,
        edges,
      })
      
      console.log('Workflow execution result:', response.data)
      
      // Show success message with execution details
      const executionLog = response.data.log
      const nodeCount = Object.keys(executionLog.results).length
      
      toast.success('Workflow executed successfully!', {
        description: `Executed ${nodeCount} nodes with status: ${executionLog.status}`
      })
    } catch (error) {
      console.error('Error executing workflow:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
      toast.error('Workflow execution failed', {
        description: errorMessage
      })
    } finally {
      setExecuting(false)
    }
  }

  const toggleWorkflowActive = async () => {
    if (!activeWorkflow) return

    try {
      setActivating(true)
      const newIsActive = !activeWorkflow.isActive
      const response = await api.update(activeWorkflow._id, {
        isActive: newIsActive,
      })
      
      const updatedWorkflow = response.data
      setActiveWorkflow(updatedWorkflow)
      setWorkflows(workflows.map(w => w._id === updatedWorkflow._id ? updatedWorkflow : w))
      
      if (newIsActive) {
        toast.success('Workflow activated', {
          description: 'Scheduled triggers are now active'
        })
      } else {
        toast.success('Workflow deactivated', {
          description: 'Scheduled triggers have been stopped'
        })
      }
    } catch (error) {
      console.error('Error toggling workflow active state:', error)
      toast.error('Failed to toggle workflow', {
        description: error.response?.data?.message || error.message
      })
    } finally {
      setActivating(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-[#0a0a0a] relative h-full">
      {/* Header */}
      {activeWorkflow && (
        <div 
          className="h-16! bg-[#1a1a1a]! flex! items-center! justify-between! px-6! z-10!"
          style={{
            borderBottom: '1px solid',
            borderImage: 'linear-gradient(to right, rgba(133, 64, 157, 0), #85409D, #999999) 1'
          }}
        >
          <div>
            <h2 className="text-lg! font-semibold! text-[#e0e0e0]!">
              {activeWorkflow.name}
            </h2>
            <p className="text-xs! text-[#999999]!">
              {`${nodes.length} nodes • ${edges.length} connections`}
            </p>
          </div>
          <div className="flex! gap-3!">
            <button
              onClick={toggleWorkflowActive}
              disabled={activating}
              className={`border-none! text-white! px-4! py-2! rounded! transition-colors! disabled:!opacity-50! flex! items-center! gap-2! ${
                activeWorkflow.isActive
                  ? 'bg-green-600! hover:bg-green-700!'
                  : 'bg-[#1a1a2e]! hover:bg-[#85409D]!'
              }`}
              title={activeWorkflow.isActive ? 'Deactivate workflow' : 'Activate workflow for scheduling'}
            >
              {activating ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  {activeWorkflow.isActive ? 'Deactivating...' : 'Activating...'}
                </>
              ) : (
                <>
                  <Power size={16} />
                  {activeWorkflow.isActive ? 'Active' : 'Inactive'}
                </>
              )}
            </button>
            <button
              onClick={validateWorkflow}
              disabled={validating || nodes.length === 0}
              className="border-none! bg-[#1a1a2e]! hover:bg-[#85409D]! text-white! px-4! py-2! rounded! transition-colors! disabled:!opacity-50! flex! items-center! gap-2!"
              title="Validate workflow with AI"
            >
              {validating ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Validating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  AI Validate
                </>
              )}
            </button>
            <button
              onClick={executeWorkflow}
              disabled={executing || nodes.length === 0}
              className="border-none! bg-[#1a1a2e]! hover:bg-[#a855f7]! text-white! px-4! py-2! rounded! transition-colors! disabled:!opacity-50! flex! items-center! gap-2!"
            >
              {executing ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Executing...
                </>
              ) : (
                <>
                  <Play size={16} />
                  Execute
                </>
              )}
            </button>
            <button
              onClick={saveWorkflow}
              disabled={saving}
              className="bg-[#85409D]! hover:bg-[#a855f7]! text-white! px-4! py-2! rounded! transition-colors! disabled:opacity-50!"
            >
              {saving ? 'Saving...' : 'Save Workflow'}
            </button>
          </div>
        </div>
      )}

      {/* Canvas Area */}
      {activeWorkflow ? (
        <div 
          className={`flex-1! relative! overflow-hidden! bg-[#1a1a1a]! w-full! h-full! ${isOver ? 'bg-opacity-75!' : ''}`}
          ref={(node) => {
            reactFlowWrapper.current = node
            drop(node)
          }}
        >
          <DotGrid 
            dotSize={3}
            gap={20}
            baseColor="#85409D"
            activeColor="#b366ff"
            proximity={150}
            speedTrigger={100}
            shockRadius={250}
            shockStrength={5}
            className="absolute! inset-0! pointer-events-none!"
          />
          <div className="w-full! h-full! relative!">
            <ReactFlow
              nodes={nodesWithValidation}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onInit={setReactFlowInstance}
              nodeTypes={nodeTypes}
              fitView
              proOptions={{ hideAttribution: true }}
            >
              <Controls style={{ color: '#ffffff !important', border: 'none !important' }} className="space-y-3!" />
              <MiniMap position="bottom-left" style={{ left: '50px' }} className="bg-[#1a1a1a]! border-none! rounded!" />
            </ReactFlow>
            {showSaveIndicator && (
              <div className="absolute! top-4! right-4! flex! items-center! gap-2! text-green-400! text-sm! animate-pulse! bg-[#1a1a2e]! px-3! py-2! rounded! border! border-green-400/30!">
                <Check size={16} />
                <span>Saved</span>
              </div>
            )}
          </div>
          <NodeToolbar nodeCount={nodes.length} className="!bg-[#1a1a1a]! !border-[#85409D]! !rounded!" />
          {showNodeConfig && selectedNode && (
            <NodeConfig
              node={selectedNode}
              onClose={() => setShowNodeConfig(false)}
              onUpdate={(updatedNode) => {
                onUpdateNode(updatedNode)
                setShowNodeConfig(false)
              }}
            />
          )}
          <AIAssistant workflowContext={workflowContext} />
        </div>
      ) : (
        <div className="flex-1 relative overflow-hidden bg-[#1a1a1a]">
          <DotGrid 
            dotSize={3}
            gap={20}
            baseColor="#85409D"
            activeColor="#b366ff"
            proximity={150}
            speedTrigger={100}
            shockRadius={250}
            shockStrength={5}
            className="absolute inset-0 pointer-events-none"
          />
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="text-center">
              <p className="text-[#999999] text-lg">Select a workflow to begin</p>
              <p className="text-[#666666] text-sm mt-2">Create a new workflow in the sidebar</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
