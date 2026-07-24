from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.database.config import get_db
from app.schemas.schemas import ProjectCreate, ProjectResponse
from app.services.project_service import create_project, get_user_projects, get_project_by_id, delete_project
from app.utils.security import decode_access_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()
router = APIRouter(prefix="/projects", tags=["projects"])


from app.models.models import User

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)) -> int:
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    
    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    return user.id



@router.get("", response_model=List[ProjectResponse])
def get_projects(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    return get_user_projects(db, user_id)


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_new_project(project_data: ProjectCreate, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    try:
        return create_project(db, user_id, project_data)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    try:
        return get_project_by_id(db, project_id, user_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project_endpoint(project_id: int, user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    try:
        delete_project(db, project_id, user_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
