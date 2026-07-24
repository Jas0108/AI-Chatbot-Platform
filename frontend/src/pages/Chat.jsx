import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { chatAPI, projectsAPI } from '../services/api';

const AGENT_CONFIG = {
  coding: { label: 'Coding Expert', badge: 'bg-sky-50 text-sky-800 border-sky-200' },
  fitness: { label: 'Fitness Coach', badge: 'bg-amber-50 text-amber-800 border-amber-200' },
  study: { label: 'Study Assistant', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  general: { label: 'General Assistant', badge: 'bg-purple-50 text-purple-800 border-purple-200' }
};

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const { projectId } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchProject();
    fetchMessages();
  }, [projectId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchProject = async () => {
    try {
      const response = await projectsAPI.getProject(projectId);
      setProject(response.data);
    } catch (err) {
      setError('Failed to load project');
      if (err.response?.status === 404) {
        navigate('/dashboard');
      }
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await chatAPI.getMessages(projectId);
      setMessages(response.data);
    } catch (err) {
      setError('Failed to load messages');
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setError('');
    setLoading(true);

    try {
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

      const response = await chatAPI.sendMessage(projectId, userMessage);
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send message');
      setInput(userMessage);
    } finally {
      setLoading(false);
    }
  };

  const agent = AGENT_CONFIG[project?.agent_type?.toLowerCase()] || {
    label: project?.agent_type || 'AI Assistant',
    badge: 'bg-stone-100 text-stone-700 border-stone-200',
  };

  return (
    <div className="min-h-screen bg-[#f6f0e8] text-stone-800 flex flex-col h-screen overflow-hidden font-sans">
      {/* Navigation Header */}
      <header className="bg-[#fcf9f2] border-b border-[#e4d9c9] shrink-0 z-50 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-16 flex justify-between items-center">
          <Link
            to="/dashboard"
            className="px-3 py-1.5 rounded-lg btn-secondary text-xs font-medium flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Dashboard</span>
          </Link>

          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-stone-900 tracking-tight">{project?.name || 'Chat Workspace'}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${agent.badge}`}>
              {agent.label}
            </span>
          </div>

          <div className="w-20 hidden sm:block"></div>
        </div>
      </header>

      {/* Main Chat Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 flex flex-col overflow-hidden min-h-0">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs mb-3 flex items-center gap-2 shrink-0">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Message Log */}
        <div className="flex-1 bg-[#ede3d4]/70 border border-[#e4d9c9] rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 my-auto">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#942f2f] flex items-center justify-center mb-3 border border-rose-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-stone-900 mb-1">Start Conversation</h3>
              <p className="text-stone-500 text-xs max-w-sm">
                Your {agent.label} is ready. Type your prompt below to start chatting.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[#942f2f] text-white shadow-sm'
                      : 'bg-[#fcf9f2] text-stone-800 border border-[#e4d9c9] shadow-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#fcf9f2] text-stone-500 p-3.5 rounded-2xl border border-[#e4d9c9] shadow-sm text-xs flex items-center gap-2">
                <svg className="animate-spin h-3.5 w-3.5 text-[#942f2f]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>AI is thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSend} className="mt-3 shrink-0">
          <div className="flex gap-2 bg-[#fcf9f2] p-2 rounded-2xl border border-[#e4d9c9] shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2.5 rounded-xl app-input text-sm border-0 focus:ring-0"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-5 py-2.5 rounded-xl btn-primary font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Send</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Chat;
