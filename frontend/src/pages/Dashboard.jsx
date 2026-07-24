import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';

const AGENT_CONFIG = {
  coding: {
    label: 'Coding Expert',
    badge: 'bg-sky-50 text-sky-800 border-sky-200',
  },
  fitness: {
    label: 'Fitness Coach',
    badge: 'bg-amber-50 text-amber-800 border-amber-200',
  },
  study: {
    label: 'Study Assistant',
    badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  },
  general: {
    label: 'General Assistant',
    badge: 'bg-purple-50 text-purple-800 border-purple-200',
  }
};

function Dashboard({ onLogout }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getProjects();
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      await projectsAPI.deleteProject(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      setError('Failed to delete project');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  return (
    <div className="min-h-screen bg-[#f6f0e8] text-stone-800 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="bg-[#fcf9f2] border-b border-[#e4d9c9] sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#942f2f] flex items-center justify-center text-white font-bold text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="font-bold text-base text-stone-900 tracking-tight">AI Chatbot Platform</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/create-project"
              className="px-3.5 py-1.5 rounded-lg btn-primary text-xs font-semibold flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>New Project</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg btn-secondary text-xs font-medium flex items-center gap-1.5 cursor-pointer"
            >
              <span>Logout</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Area */}
      <main className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Projects</h1>
            <p className="text-slate-500 text-sm mt-0.5">Select a project to start chatting with your AI assistant</p>
          </div>

          <button
            onClick={() => navigate('/create-project')}
            className="px-4 py-2 rounded-xl btn-primary text-sm font-semibold flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>Create New Project</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs mb-6 flex items-center gap-2">
            <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <svg className="animate-spin h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-slate-500 text-sm">Loading projects...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-[#fcf9f2] border border-[#e4d9c9] p-10 rounded-2xl text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#942f2f] flex items-center justify-center mx-auto mb-3 border border-rose-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-stone-900 mb-1">No Projects Yet</h3>
            <p className="text-stone-500 text-xs mb-6">
              Create your first project to start interacting with custom AI assistants.
            </p>
            <button
              onClick={() => navigate('/create-project')}
              className="px-4 py-2 rounded-xl btn-primary text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Create Project</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((project) => {
              const agent = AGENT_CONFIG[project.agent_type?.toLowerCase()] || {
                label: project.agent_type,
                badge: 'bg-stone-100 text-stone-700 border-stone-200',
              };

              return (
                <div
                  key={project.id}
                  className="bg-[#fcf9f2] border border-[#e4d9c9] hover:border-[#cbbea9] p-6 rounded-2xl flex flex-col justify-between transition-all shadow-sm hover:shadow"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${agent.badge}`}>
                        {agent.label}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 mb-1 line-clamp-1">{project.name}</h3>
                    <p className="text-stone-500 text-xs line-clamp-2 mb-6 leading-relaxed">
                      {project.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-stone-200/60">
                    <button
                      onClick={() => navigate(`/chat/${project.id}`)}
                      className="flex-1 py-2 px-3 rounded-lg btn-primary text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Open Chat</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 transition-all text-xs cursor-pointer"
                      title="Delete Project"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
