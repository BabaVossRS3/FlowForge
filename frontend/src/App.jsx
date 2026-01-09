import { useState, useContext } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { AuthContext } from './context/AuthContext'
import { TriggerOutputProvider } from './context/TriggerOutputContext'
import Sidebar from './components/Sidebar'
import Canvas from './components/Canvas'
import LoginModal from './components/LoginModal'
import { Toaster } from './components/ui/sonner'
import './App.css'

function App() {
  const { loading } = useContext(AuthContext)
  const [workflows, setWorkflows] = useState([])
  const [activeWorkflow, setActiveWorkflow] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-[#0a0a0a]">
        <div className="text-[#e0e0e0]">Loading...</div>
      </div>
    )
  }

  return (
    <TriggerOutputProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="flex h-screen w-screen bg-[#0a0a0a] text-[#e0e0e0]">
          <div className="w-1/5 h-full">
            <Sidebar 
              workflows={workflows} 
              setWorkflows={setWorkflows}
              activeWorkflow={activeWorkflow}
              setActiveWorkflow={setActiveWorkflow}
              showLoginModal={showLoginModal}
              setShowLoginModal={setShowLoginModal}
            />
          </div>
          <div className="flex-1 h-full">
            <Canvas 
              workflows={workflows}
              setWorkflows={setWorkflows}
              activeWorkflow={activeWorkflow}
              setActiveWorkflow={setActiveWorkflow}
            />
          </div>
        </div>
        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} />
        )}
        <Toaster position="top-center" toastOptions={{
          style: {
            background: '#1a1a2e',
            border: '1px solid #444',
            color: '#e0e0e0',
          },
          classNames: {
            success: 'success-toast',
          },
        }} />
      </DndProvider>
    </TriggerOutputProvider>
  )
}

export default App
