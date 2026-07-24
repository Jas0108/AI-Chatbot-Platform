import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('token', response.data.access_token);
      onLogin();
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f0e8] flex flex-col lg:flex-row font-sans text-stone-800">
      {/* Left Column: Rich Product Overview */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#e4d9c9] bg-[#ede3d4]">
        <div>
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-9 h-9 rounded-xl bg-[#942f2f] flex items-center justify-center text-white font-bold text-sm shadow-sm">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-stone-900 tracking-tight">AI Chatbot Platform</span>
          </div>

          {/* Heading & General Overview */}
          <div className="max-w-md">
            <h1 className="text-3xl lg:text-4xl font-bold text-stone-900 leading-tight mb-4">
              AI Chatbot Platform
            </h1>
            <p className="text-stone-700 text-sm lg:text-base leading-relaxed mb-8">
              A personal workspace to create your own chats and interact with different AI agents tailored for multipurpose tasks.
            </p>

            {/* Bullet Point List */}
            <div className="space-y-4 text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#942f2f] mt-2 shrink-0" />
                <div>
                  <span className="font-semibold text-stone-900">Multipurpose Agents: </span>
                  <span className="text-stone-700 leading-relaxed">Choose from different agents configured for different purposes and tasks.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#942f2f] mt-2 shrink-0" />
                <div>
                  <span className="font-semibold text-stone-900">Custom Conversations: </span>
                  <span className="text-stone-700 leading-relaxed">Make your own chats and organize them into distinct project spaces.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#942f2f] mt-2 shrink-0" />
                <div>
                  <span className="font-semibold text-stone-900">Persistent History: </span>
                  <span className="text-stone-700 leading-relaxed">Saves conversation memory across all your ongoing chat sessions.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-xs text-stone-500">
          &copy; {new Date().getFullYear()} AI Chatbot Platform. All rights reserved.
        </div>
      </div>

      {/* Right Column: Form Container */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex items-center justify-center bg-[#f6f0e8]">
        <div className="w-full max-w-md bg-[#fcf9f2] border border-[#e4d9c9] p-8 rounded-2xl shadow-sm">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-stone-900">Sign in to your account</h2>
            <p className="text-stone-500 text-xs mt-1">Enter your credentials below to access your workspace</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs mb-6 flex items-center gap-2">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-stone-700 text-xs font-medium uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl app-input text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 text-xs font-medium uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl app-input text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl btn-primary text-sm font-semibold flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-stone-500 pt-4 border-t border-stone-200/80">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#942f2f] font-semibold hover:text-[#7b2424] transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
