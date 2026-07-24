from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.config import engine, Base
from app.routes import auth, projects, chat

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Chatbot Platform", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(chat.router)


@app.get("/")
def root():
    return {"message": "AI Chatbot Platform API"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
