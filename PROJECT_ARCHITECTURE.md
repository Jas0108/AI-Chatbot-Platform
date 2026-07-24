# AI Chatbot Platform – Architecture & System Design Document

## 1. System Architecture Overview

The platform uses a modern **3-Tier Client-Server Architecture** designed for high modularity, clean separation of concerns, and low latency.

```mermaid
graph TD
    subgraph "Tier 1: Client Layer (Frontend)"
        UI["React 18 SPA"] --> Router["React Router DOM"]
        UI --> Axios["Axios HTTP Client"]
    end

    subgraph "Tier 2: Application Layer (Backend API)"
        Axios -->|JSON / REST| FastAPI["FastAPI App Server"]
        FastAPI --> AuthMiddleware["JWT Auth Middleware"]
        FastAPI --> Services["Service Layer: Auth / Projects / Chat"]
        Services --> Sanitizer["Response Sanitizer Engine"]
    end

    subgraph "Tier 3: Data & External AI Layer"
        Services --> ORM["SQLAlchemy ORM"]
        ORM <--> DB[("SQLite Database")]
        Services --> LangChain["LangChain AI Pipeline"]
        LangChain <-->|HTTPS API Key| OpenRouter["OpenRouter LLM API"]
    end
```

---

## 2. Component Design & Layer Responsibilities

### Tier 1: Presentation Layer (Frontend)
- **Framework**: React 18 built with Vite for fast HMR and sub-3-second builds.
- **Routing & State**: React Router handles SPA routing between `Login`, `Register`, `Dashboard`, `CreateProject`, and `Chat`. Token state is synchronized via browser `localStorage`.
- **Styling**: Tailwind CSS combined with clean vanilla CSS tokens for a responsive slate/indigo design.

### Tier 2: Business & Application Layer (Backend API)
- **API Framework**: FastAPI provides high-performance asynchronous endpoints with automatic OpenAPI documentation.
- **Security Design**: Stateless authentication using JWT (JSON Web Tokens) with 30-minute expiration. Passwords are securely hashed using `bcrypt`.
- **Middleware**: CORS middleware permits cross-origin requests from the React frontend.

### Tier 3: Data & LLM Orchestration Layer
- **Persistence**: SQLAlchemy ORM manages relational persistence with SQLite.
- **AI Engine**: LangChain constructs `SystemMessage`, historical `AIMessage`/`HumanMessage` context, and streams calls to OpenRouter (`qwen/qwen3-coder:free`).

---

## 3. Database Architecture & ER Diagram

The database utilizes a relational 3-entity model with cascading foreign key relationships.

```mermaid
erDiagram
    USER ||--o{ PROJECT : "owns (1:N)"
    PROJECT ||--o{ MESSAGE : "contains (1:N)"

    USER {
        int id PK
        string name
        string email UK
        string password_hash
        datetime created_at
    }

    PROJECT {
        int id PK
        int user_id FK
        string name
        text description
        string agent_type
        text system_prompt
        datetime created_at
    }

    MESSAGE {
        int id PK
        int project_id FK
        string role
        text content
        datetime created_at
    }
```

---

## 4. Detailed Data & Execution Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User Browser
    participant API as FastAPI Router
    participant DB as Database (SQLAlchemy)
    participant Engine as Chat Service
    participant LLM as OpenRouter LLM

    User->>API: POST /projects/{id}/chat {"message": "..."}
    API->>API: Verify JWT Token in Authorization header
    API->>DB: Save user message (role="user")
    API->>DB: Query last 10 messages for conversation context
    API->>Engine: Build SystemMessage + Context History + User Prompt
    Engine->>LLM: Invoke Model via LangChain
    LLM-->>Engine: Raw AI Response Text
    Engine->>Engine: Pass text through clean_agent_response()
    Engine->>DB: Save sanitized response (role="assistant")
    API-->>User: Return {"response": "Cleaned response text"}
```

---

## 5. Key System Design Decisions

1. **Persona-Based System Prompts**:
   - Instead of complex multi-agent overhead, each project is assigned a specialized domain prompt (**Coding**, **Fitness**, **Study**, **General**) upon creation, enforcing role adherence directly at the LLM level.

2. **Response Sanitization Engine (`clean_agent_response`)**:
   - Implements a real-time Regex pipeline that preserves standard markdown code blocks (` ```python ... ``` `) while stripping unwanted symbol clutter (`|`, `**`, `---`, `#`) outside code blocks for clean UI rendering.

3. **Sliding Context Window**:
   - The server fetches the last 10 messages per chat turn, balancing token budget and conversation memory.

4. **Data Isolation**:
   - Every API request validates the authenticated user ID against the project owner ID, preventing unauthorized access.

---

