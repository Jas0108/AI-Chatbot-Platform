# 🎬 AI Chatbot Platform — Video Presentation & Demo Script

> **Target Duration**: ~2.5 to 3 Minutes  
> **Live App**: [https://ai-chatbot-platform-sigma.vercel.app/](https://ai-chatbot-platform-sigma.vercel.app/)  
> **Backend API**: [https://ai-chatbot-platform-z04j.onrender.com](https://ai-chatbot-platform-z04j.onrender.com)

---

## 📌 Demo Preparation Checklist
- [ ] Open your live Vercel app in Chrome: `https://ai-chatbot-platform-sigma.vercel.app/`
- [ ] Ensure microphone audio is clear.
- [ ] Have a test account ready (or register a fresh one live).

---

## ⏱️ Scene-by-Scene Script

---

### 🟢 Scene 1: Introduction & Platform Overview (0:00 – 0:35)

**🎥 Screen Action**:  
Start on the **Landing / Authentication Page** of the live Vercel application. Hover cursor over the hero header and modern dark-mode aesthetic.

**🗣️ What to Say (Spoken Script)**:
> *"Hello everyone! Welcome to the demonstration of my full-stack project — the **AI Chatbot & Agent Orchestration Workspace**.*  
>  
> *This platform is built using a modern 3-tier architecture: a **React 18** frontend powered by Vite, a high-performance **FastAPI** Python backend, **SQLite** for relational database storage, and **LangChain** integrated with **OpenRouter LLMs** for intelligent multi-agent orchestration.*  
>  
> *Let me take you through the key features and implementation details."*

---

### 🟢 Scene 2: Authentication & Multi-Tenant Security (0:35 – 0:55)

**🎥 Screen Action**:  
Click on **Register** (or **Login**). Type in user credentials (e.g., `demo_user@example.com` / `Password123!`) and click **Sign In**. Show the transition into the main **Dashboard**.

**🗣️ What to Say (Spoken Script)**:
> *"First, we have secure user authentication. The backend implements **bcrypt** password hashing and issues stateless **JWT tokens** with a 30-minute expiration.*  
>  
> *Every user gets their own isolated workspace — meaning your projects, agent conversations, and chat histories are strictly protected and private to your account."*

---

### 🟢 Scene 3: Specialized Agent Personas & Project Creation (0:55 – 1:35)

**🎥 Screen Action**:  
Click the **"+ Create New Project"** button. Hover over the persona selection cards (**Coding Expert**, **Fitness & Health Coach**, **Study Assistant**, and **General Assistant**). Select **Study Assistant** or **Coding Expert**, fill in a project title (e.g., *"Academic Tutor"*), and click **Create Project**.

**🗣️ What to Say (Spoken Script)**:
> *"Now on the dashboard, we can create isolated AI projects powered by specialized agent personas.*  
>  
> *We have four custom-engineered prompt personas:*  
> 1. ***Coding Expert*** — *for software architecture, code reviews, and debugging.*  
> 2. ***Fitness & Health Coach*** — *for workout routines and nutrition science.*  
> 3. ***Study Assistant*** — *offering step-by-step guidance across Mathematics, Science, History, and English.*  
> 4. ***General Assistant*** — *for open-ended brainstorming and research.*  
>  
> *Let me select **Study Assistant** and launch our workspace."*

---

### 🟢 Scene 4: Real-Time Chat & Response Sanitization Engine (1:35 – 2:20)

**🎥 Screen Action**:  
Inside the project workspace, type a query in the chat input:  
`"Explain the concept of Pythagoras Theorem with a quick formula and example."`  
Press **Send**. Scroll through the streaming response to highlight the clean formatting and code blocks.

**🗣️ What to Say (Spoken Script)**:
> *"Here in the interactive chat workspace, the agent maintains full conversation history per project, retrieving sliding windows of past context to provide coherent responses.*  
>  
> *One key technical feature I developed is the **Response Sanitization Engine**. In standard LLM responses, raw text often gets cluttered with raw table dividers, messy asterisks, or markdown hashtags.*  
>  
> *Our backend sanitization engine automatically cleans prose into readable bullet points and structured headings while strictly preserving standard programming code blocks."*

---

### 🟢 Scene 5: Production Deployment & Closing (2:20 – 3:00)

**🎥 Screen Action**:  
Briefly switch tabs to show the **GitHub Repository**, the **Render Backend Dashboard**, or the `PROJECT_ARCHITECTURE.md` file. Return to the Vercel app tab.

**🗣️ What to Say (Spoken Script)**:
> *"Finally, for production deployment, the frontend is deployed globally on **Vercel** with HTTPS security, while the backend API is hosted on **Render** running Python Uvicorn.*  
>  
> *The entire codebase, complete with system architecture documentation and ER diagrams, is publicly hosted on GitHub.*  
>  
> *Thank you for watching the demo! I'd be happy to take any questions from the panel."*

---

## 🎯 Quick Talking Points for Panel Questions

| Expected Question | Best Answer |
|---|---|
| **How does multi-agent prompting work?** | *"Each project persona injects a specialized system prompt into LangChain, defining strict behavioral boundaries and subject-matter expertise before user messages are evaluated."* |
| **How do you handle security?** | *"Passwords are hashed with direct `bcrypt` salt rounds, and endpoints are guarded with HTTP Bearer JWT token verification."* |
| **How is deployment structured?** | *"Frontend static assets build on Vercel over CDN, communicating asynchronously via REST endpoints with the FastAPI Uvicorn engine on Render."* |
