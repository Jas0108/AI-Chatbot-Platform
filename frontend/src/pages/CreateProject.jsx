import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const AGENT_OPTIONS = [
  { id: 'coding', title: 'Coding Expert', desc: 'Software development, architecture, code reviews, and debugging.' },
  { id: 'fitness', title: 'Fitness & Health Coach', desc: 'Workout programming, nutrition, macro tracking, and recovery.' },
  { id: 'study', title: 'Study Assistant', desc: 'Homework guidance and comprehensive support across Mathematics, Science, History, and English.' },
  { id: 'general', title: 'General Assistant', desc: 'Versatile helper for general questions, brainstorming, and conversation.' },
];

function CreateProject() {
  const [formData, setFormData] = useState({ name: '', description: '', agent_type: 'coding' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectAgent = (type) => {
    setFormData({ ...formData, agent_type: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await projectsAPI.createProject(formData);
      navigate(`/chat/${response.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f0e8] text-stone-800 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-[#fcf9f2] border-b border-[#e4d9c9] sticky top-0 z-50 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            to="/dashboard"
            className="text-stone-600 hover:text-stone-900 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
          </Link>
          <span className="font-semibold text-sm text-stone-700">Create Project</span>
        </div>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Create New AI Project</h1>
          <p className="text-stone-500 text-sm mt-1">Select an agent persona and give your project a name.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs mb-6 flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-[#fcf9f2] border border-[#e4d9c9] p-6 sm:p-8 rounded-2xl shadow-sm space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">Project Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Code Reviewer or Trip Planner"
              className="w-full px-4 py-2.5 rounded-xl app-input text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2">Description (Optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="What is the main goal of this project?"
              className="w-full px-4 py-2.5 rounded-xl app-input text-sm"
              rows="3"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-3">Select AI Assistant Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {AGENT_OPTIONS.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => handleSelectAgent(agent.id)}
                  className={`cursor-pointer p-4 rounded-xl border transition-all ${
                    formData.agent_type === agent.id
                      ? 'bg-rose-50/80 border-[#942f2f] text-stone-950 shadow-sm'
                      : 'bg-[#fdfaf4] border-[#e4d9c9] text-stone-700 hover:border-[#cbbea9]'
                  }`}
                >
                  <div className="font-semibold text-sm mb-1 text-stone-900">{agent.title}</div>
                  <div className="text-xs text-stone-500">{agent.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl btn-primary text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Project...</span>
                </>
              ) : (
                <span>Create Project</span>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default CreateProject;
