import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { getAIAPI } from '../lib/api';
import { toast } from 'sonner';

export default function AIAssistant({ workflowContext }) {
  const { token } = useContext(AuthContext);
  const aiAPI = getAIAPI(token);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I\'m your AI workflow assistant. Ask me anything about creating workflows, fixing issues, or best practices!',
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!query.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const response = await aiAPI.getGuidance(query, workflowContext);
      const assistantMessage = {
        role: 'assistant',
        content: response.data.guidance.guidance,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI guidance error:', error);
      toast.error('Failed to get AI guidance', {
        description: error.response?.data?.message || 'Please try again'
      });
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed! bottom-24! right-6! w-96! h-[500px]! bg-[#1a1a1a]! border! border-[#85409D]/30! rounded-lg! shadow-2xl! flex! flex-col! z-50!"
          >
            <div className="flex! items-center! justify-between! p-4! border-b! border-[#85409D]/30!">
              <div className="flex! items-center! gap-2!">
                <Sparkles size={20} className="text-[#85409D]!" />
                <h3 className="text-white! font-semibold!">AI Assistant</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#999999]! hover:text-white! transition-colors!"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1! overflow-y-auto! p-4! space-y-4!">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex! ${message.role === 'user' ? 'justify-end!' : 'justify-start!'}`}
                >
                  <div
                    className={`max-w-[80%]! p-3! rounded-lg! ${
                      message.role === 'user'
                        ? 'bg-[#85409D]! text-white!'
                        : 'bg-[#2a2a2a]! text-[#e0e0e0]!'
                    }`}
                  >
                    <p className="text-sm! whitespace-pre-wrap!">{message.content}</p>
                    <p className="text-xs! opacity-50! mt-1!">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex! justify-start!">
                  <div className="bg-[#2a2a2a]! p-3! rounded-lg!">
                    <Loader2 size={16} className="animate-spin! text-[#85409D]!" />
                  </div>
                </div>
              )}
            </div>

            <div className="p-4! border-t! border-[#85409D]/30!">
              <div className="flex! gap-2!">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  disabled={loading}
                  className="flex-1! bg-[#2a2a2a]! text-white! px-3! py-2! rounded! border! border-[#85409D]/30! focus:outline-none! focus:border-[#85409D]! disabled:opacity-50!"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!query.trim() || loading}
                  className="bg-[#85409D]! hover:bg-[#a855f7]! text-white! p-2! rounded! transition-colors! disabled:opacity-50! disabled:cursor-not-allowed!"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed! bottom-6! right-6! w-14! h-14! bg-linear-to-br! from-[#85409D]! to-[#a855f7]! rounded-full! shadow-lg! flex! items-center! justify-center! text-white! z-50! hover:shadow-xl! transition-shadow!"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        <span className="absolute! -top-1! -right-1! w-3! h-3! bg-green-400! rounded-full! animate-pulse!" />
      </motion.button>
    </>
  );
}
