import { useState, useEffect, useContext } from 'react'
import { Plus, Trash2, Play, Save, Loader, LogOut, Settings } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'
import { getWorkflowsAPI } from '../lib/api'
import { Avatar, AvatarFallback } from './ui/avatar'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'
import IntegrationSettings from './IntegrationSettings'
import { toast } from 'sonner'

export default function Sidebar({ workflows, setWorkflows, activeWorkflow, setActiveWorkflow, showLoginModal, setShowLoginModal }) {
  const { token, user, logout } = useContext(AuthContext)
  const [newWorkflowName, setNewWorkflowName] = useState('')
  const [loading, setLoading] = useState(false)
  const [executing, setExecuting] = useState({})
  const [executionLogs, setExecutionLogs] = useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [workflowToDelete, setWorkflowToDelete] = useState(null)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const api = getWorkflowsAPI(token)

  const fetchWorkflows = async () => {
    try {
      const response = await api.getAll()
      setWorkflows(response.data)
    } catch (error) {
      console.error('Error fetching workflows:', error)
    }
  }

  const createWorkflow = async () => {
    if (!newWorkflowName.trim()) return

    if (!user) {
      setShowLoginModal(true)
      return
    }

    try {
      setLoading(true)
      const response = await api.create({
        name: newWorkflowName,
        description: '',
        nodes: [],
        edges: [],
      })
      setWorkflows([...workflows, response.data])
      setActiveWorkflow(response.data)
      setNewWorkflowName('')
    } catch (error) {
      console.error('Error creating workflow:', error)
    } finally {
      setLoading(false)
    }
  }

  const openDeleteDialog = (workflow) => {
    setWorkflowToDelete(workflow)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!workflowToDelete) return
    try {
      await api.delete(workflowToDelete._id)
      setWorkflows(workflows.filter(w => w._id !== workflowToDelete._id))
      if (activeWorkflow?._id === workflowToDelete._id) setActiveWorkflow(null)
      setDeleteDialogOpen(false)
      setWorkflowToDelete(null)
    } catch (error) {
      console.error('Error deleting workflow:', error)
    }
  }

  const fetchExecutionLogs = async (id) => {
    try {
      const response = await api.getLogs(id)
      setExecutionLogs(prev => ({
        ...prev,
        [id]: response.data
      }))
    } catch (error) {
      console.error('Error fetching execution logs:', error)
    }
  }

  const executeWorkflow = async (id) => {
    try {
      setExecuting(prev => ({ ...prev, [id]: true }))
      const workflow = workflows.find(w => w._id === id)
      
      if (!workflow) {
        console.error('Workflow not found')
        return
      }

      const response = await api.execute(id, {
        nodes: workflow.nodes,
        edges: workflow.edges,
      })
      
      fetchExecutionLogs(id)
      fetchWorkflows()
    } catch (error) {
      console.error('Error executing workflow:', error)
      toast.error('Execution failed', {
        description: error.response?.data?.message || error.message
      })
    } finally {
      setExecuting(prev => ({ ...prev, [id]: false }))
    }
  }

  useEffect(() => {
    fetchWorkflows()
  }, [])

  useEffect(() => {
    if (activeWorkflow) {
      fetchExecutionLogs(activeWorkflow._id)
    }
  }, [activeWorkflow])

  return (
    <div 
      className="w-full bg-[#1a1a1a] flex flex-col h-full"
      style={{
        borderRight: '1px solid',
        borderImage: 'linear-gradient(to bottom, rgba(133, 64, 157, 0), #85409D, #999999) 1'
      }}
    >
      {/* Header */}
      <div className="p-6!">
        <div>
          <h1 className="text-2xl font-montserrat font-light text-[#85409D] mb-2">FlowForge</h1>
          <p className="text-sm text-[#999999]">Visual Workflow Automation</p>
        </div>
      </div>

      {/* Create Workflow Section */}
      <div className="p-6!">
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Workflow name..."
            value={newWorkflowName}
            onChange={(e) => setNewWorkflowName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createWorkflow()}
            className="flex-1 bg-[#4444]  px-3! py-2 text-[#e0e0e0] placeholder-[#666666]"
          />
          <button
            onClick={createWorkflow}
            disabled={loading}
            className="bg-[#4444]! hover:bg-[#a855f7] text-white p-2 rounded! transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        <button
          onClick={fetchWorkflows}
          className="w-full bg-[#2a2a3e]! hover:bg-[#3a3a4e]! text-[#e0e0e0] my-2! py-2! rounded! text-sm transition-colors"
        >
          Refresh Workflows
        </button>
      </div>

      {/* Workflows List */}
      <div className="flex-1 overflow-y-auto p-4!">
        <h2 className="text-lg font-semibold text-[#dcd2e0] mb-6 tracking-wide">Workflows</h2>
        {workflows.length === 0 ? (
          <p className="text-[#666666] text-sm mt-2!">No workflows yet. Create one to get started.</p>
        ) : (
          <div className="space-y-4!">
            {workflows.map((workflow) => (
              <div
                key={workflow._id}
                className={`p-2! mt-2! rounded border-none! transition-all cursor-pointer ${
                  activeWorkflow?._id === workflow._id
                    ? 'bg-[#2a2a3e]! border-none! text-white py-2! px-2!'
                    : 'bg-[#2a2a3e]! text-[#e0e0e0] hover:bg-[#3a3a4e]!'
                }`}
                onClick={() => setActiveWorkflow(workflow)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{workflow.name}</p>
                    <p className="text-xs opacity-75">
                      {workflow.nodes?.length || 0} nodes
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        executeWorkflow(workflow._id)
                      }}
                      disabled={executing[workflow._id]}
                      className="p-1 bg-[#1a1a2e]! border-none! rounded transition-colors disabled:opacity-50 hover:text-purple-400!"
                      title="Execute workflow"
                    >
                      {executing[workflow._id] ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <Play className="" size={16} />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        openDeleteDialog(workflow)
                      }}
                      className="hover:text-purple-400! p-1 bg-[#1a1a2e]! border-none! rounded transition-colors"
                      title="Delete workflow"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Workflow Info */}
      {activeWorkflow && (
        <div className="p-4! space-y-3!">
          <div>
            <h3 className="text-sm font-semibold text-[#85409D] mb-2!">Active Workflow</h3>
            <p className="text-xs text-[#e0e0e0]">{activeWorkflow.name}</p>
            <p className="text-xs text-[#666666] mt-1!">
              {activeWorkflow.nodes?.length || 0} nodes • {activeWorkflow.edges?.length || 0} connections
            </p>
          </div>

          <button
            className="w-full border-none! bg-[#1a1a2e]! hover:bg-[#a855f7]! text-white py-2 rounded text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            onClick={() => executeWorkflow(activeWorkflow._id)}
            disabled={executing[activeWorkflow._id]}
          >
            {executing[activeWorkflow._id] ? (
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

          {executionLogs[activeWorkflow._id] && executionLogs[activeWorkflow._id].length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#85409D]">
              <h4 className="text-xs font-semibold text-[#85409D] mb-2">Latest Execution</h4>
              {(() => {
                const logs = executionLogs[activeWorkflow._id];
                const latestLog = logs[logs.length - 1];
                return (
                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          latestLog.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <span className="text-[#e0e0e0]">{latestLog.status}</span>
                    </div>
                    <p className="text-[#666666]">
                      {new Date(latestLog.timestamp).toLocaleTimeString()}
                    </p>
                    {latestLog.error && (
                      <p className="text-red-400 mt-1">{latestLog.error}</p>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      )}

      {/* User Profile Section */}
      <div 
        className="border-t border-[#333] p-4!"
        style={{
          borderImage: 'linear-gradient(to right, rgba(133, 64, 157, 0), #85409D, rgba(133, 64, 157, 0)) 1'
        }}
      >
        {user ? (
          <div className="flex! items-center! justify-between! gap-2! min-w-0!">
            <div className="flex! items-center! gap-2! flex-1! min-w-0!">
              <Avatar className="bg-[#85409D]! shrink-0!">
                <AvatarFallback className="bg-[#85409D]! text-white! font-semibold! text-sm!">
                  {user.name
                    .split(' ')
                    .map(n => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1! min-w-0!">
                <p className="text-sm! font-semibold! text-[#e0e0e0]! truncate!">{user.name}</p>
                <p className="text-xs! text-[#666666]! truncate!">{user.email}</p>
              </div>
            </div>
            <div className="flex! items-center! gap-0! shrink-0!">
              <button
                onClick={() => setShowSettingsModal(true)}
                className="p-2! hover:bg-[#2a2a3e]! rounded! transition-colors! text-[#e0e0e0]! shrink-0!"
                title="Settings"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={logout}
                className="p-2! hover:bg-[#2a2a3e]! rounded! transition-colors! text-[#e0e0e0]! shrink-0!"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="w-full bg-[#85409D] hover:bg-[#a855f7] text-white py-2 rounded text-sm font-semibold transition-colors"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1a1a1a]! border-[#333]! p-4!">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#e0e0e0]!">Delete Workflow</AlertDialogTitle>
            <AlertDialogDescription className="text-[#999999]!">
              Are you sure you want to delete "{workflowToDelete?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex! gap-3! justify-end!">
            <AlertDialogCancel className="bg-[#2a2a3e]! text-[#e0e0e0]! border-[#444]! hover:bg-[#3a3a4e]!">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600! hover:bg-red-700! text-white!"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Integration Settings Modal */}
      {showSettingsModal && (
        <IntegrationSettings 
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  )
}
