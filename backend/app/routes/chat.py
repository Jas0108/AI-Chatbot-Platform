from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.config import get_db
from app.schemas.schemas import ChatRequest, MessageResponse
from app.services.chat_service import generate_chat_response, get_project_messages
from app.routes.projects import get_current_user_id

router = APIRouter(prefix="/projects/{project_id}", tags=["chat"])


@router.get("/messages", response_model=List[MessageResponse])
def get_messages(project_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    from app.services.project_service import get_project_by_id
    try:
        get_project_by_id(db, project_id, user_id)
        return get_project_messages(db, project_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.post("/chat")
def chat(project_id: int, chat_request: ChatRequest, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    try:
        response = generate_chat_response(db, project_id, chat_request.message, user_id)
        return {"response": response}
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
