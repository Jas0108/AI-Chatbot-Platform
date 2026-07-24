# AI Chatbot Platform

An **AI Chatbot & Agent Orchestration Workspace** built with **FastAPI**, **React (Vite)**, **SQLite**, **LangChain**, and **OpenRouter LLMs**. Users can register, log in, create isolated AI projects driven by specialized agent personas, and chat with AI assistants.

---

## 🌐 Live Deployment

- 🚀 **Live Web Application**: [https://ai-chatbot-platform-sigma.vercel.app/](https://ai-chatbot-platform-sigma.vercel.app/)
- ⚡ **Live Backend API**: [https://ai-chatbot-platform-z04j.onrender.com](https://ai-chatbot-platform-z04j.onrender.com)
- 📦 **GitHub Repository**: [https://github.com/Jas0108/AI-Chatbot-Platform](https://github.com/Jas0108/AI-Chatbot-Platform)

---

## Key Features

- **User Authentication & Security**:
  - Registration and Login with password hashing (`bcrypt`).
  - Stateless JWT token authorization (`HS256`) with protected API routes.
  - Multi-user isolation — users can only view and manage their own projects.

- **Specialized AI Agent Personas**:
  - **Coding Expert**: Software architecture, debugging, code reviews, and algorithms.
  - **Fitness & Health Coach**: Resistance training, workout splits, macro nutrition, and recovery.
  - **Study Assistant**: Step-by-step learning guidance across Mathematics, Science, History, and English.
  - **General Assistant**: Brainstorming, general knowledge, and conversational queries.

- **Real-Time Response Sanitization Engine**:
  - Automatically cleans LLM output outside code blocks, stripping raw markdown table clutter (`|`), asterisk bolding (`**`), header hashtags (`#`), and horizontal rule lines (`---`).
  - Preserves standard programming code blocks (` ```python ... ``` `).

- **Project & Chat Management**:
  - Create, view, and delete isolated AI projects.
  - Persistent chat history per project stored in SQLite.
  - Sliding conversation window (last 10 turns) sent to LLM for fast, contextual responses.
---

## Tech Stack

### Backend
- **FastAPI** (Python 3.8+) - High-performance asynchronous REST API framework
- **SQLAlchemy** - Relational Database ORM
- **SQLite** - Embedded database storage
- **PyJWT & Passlib (bcrypt)** - Authentication & security
- **LangChain & ChatOpenAI** - LLM prompt orchestration
- **OpenRouter API** - LLM access (`meta-llama/llama-3.3-70b-instruct:free`)

### Frontend
- **React 18** (Vite build tool)
- **Tailwind CSS** + Vanilla CSS Design Tokens
- **React Router DOM v6** - Client-side SPA routing
- **Axios** - HTTP API client with request/response interceptors

---

## Project Structure

```
Yellow IAI/
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   │   └── service.py         # Registration & authentication service
│   │   ├── database/
│   │   │   └── config.py         # SQLAlchemy engine & session setup
│   │   ├── models/
│   │   │   └── models.py         # User, Project, Message models
│   │   ├── routes/
│   │   │   ├── auth.py           # /auth endpoints (register, login)
│   │   │   ├── projects.py       # /projects endpoints (CRUD)
│   │   │   └── chat.py           # /projects/{id}/chat & messages endpoints
│   │   ├── schemas/
│   │   │   └── schemas.py        # Pydantic request/response validation
│   │   ├── services/
│   │   │   ├── project_service.py # Project business logic & persona prompts
│   │   │   └── chat_service.py   # LLM invocation & response sanitization
│   │   ├── utils/
│   │   │   └── security.py      # JWT creation/decoding & bcrypt hashing
│   │   └── main.py               # FastAPI application entry point
│   ├── .env                       # Backend environment variables
│   ├── .env.example
│   ├── requirements.txt
│   └── ai_chatbot.db             # SQLite database file
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Authentication Sign-in page
│   │   │   ├── Register.jsx      # New user registration page
│   │   │   ├── Dashboard.jsx     # Workspace dashboard & project grid
│   │   │   ├── CreateProject.jsx # Agent persona selector & project creator
│   │   │   └── Chat.jsx          # Interactive AI chat interface
│   │   ├── services/
│   │   │   └── api.js            # Axios client with JWT interceptor
│   │   ├── App.jsx               # Protected React routes
│   │   ├── main.jsx
│   │   └── index.css             # Base styles & clean design system
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── PROJECT_ARCHITECTURE.md        # Complete Architecture & System Design Document
└── README.md
```

---

## Step-by-Step Setup & Running Instructions

### Prerequisites
- **Python**: Version 3.8 or higher
- **Node.js**: Version 16 or higher (with `npm`)
- **OpenRouter API Key**: Obtain a free API key at [openrouter.ai](https://openrouter.ai/)

---

### 1. Backend Setup & Run

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Create a Python virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows (PowerShell)**:
     ```powershell
     .\venv\Scripts\Activate.ps1
     ```
   - **Linux / macOS**:
     ```bash
     source venv/bin/activate
     ```

4. Install the required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

5. Configure environment variables in `backend/.env`:
   ```env
   DATABASE_URL=sqlite:///./ai_chatbot.db
   SECRET_KEY=your-super-secret-jwt-key
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   OPENROUTER_API_KEY=your_actual_openrouter_api_key_here
   LLM_MODEL=meta-llama/llama-3.3-70b-instruct:free
   ```

6. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   *The backend API will run live on `http://127.0.0.1:8000` (API Docs available at `http://127.0.0.1:8000/docs`).*

---

### 2. Frontend Setup & Run

1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `frontend/.env` (optional, defaults to `http://localhost:8000`):
   ```env
   VITE_API_URL=http://localhost:8000
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend application will run live on `http://localhost:5173`.*

---

## End-to-End Usage Guide

1. Open your browser and go to `http://localhost:5173`.
2. Click **Register** to create a new account.
3. Sign in with your registered email and password.
4. On the **Dashboard**, click **Create New Project**.
5. Give your project a name and choose an AI Assistant Persona (**Coding**, **Fitness**, **Study**, or **General**).
6. Click **Create Project** to automatically enter the **Chat Workspace**.
7. Start sending messages to your AI assistant.

---

## API Endpoints Reference

### Authentication
- `POST /auth/register` - Create a new user account.
- `POST /auth/login` - Authenticate credentials and receive a JWT token.

### Projects
- `GET /projects` - Fetch all projects created by the authenticated user.
- `POST /projects` - Create a project assigned to a specific AI persona.
- `GET /projects/{project_id}` - Retrieve metadata for a specific project.
- `DELETE /projects/{project_id}` - Delete a project and its chat history.

### Chat
- `GET /projects/{project_id}/messages` - Fetch chat history for a project.
- `POST /projects/{project_id}/chat` - Submit a message and receive a sanitized AI response.

---


