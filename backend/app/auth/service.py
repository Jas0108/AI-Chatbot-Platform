from sqlalchemy.orm import Session
from app.models.models import User
from app.schemas.schemas import UserRegister, UserLogin
from app.utils.security import verify_password, get_password_hash, create_access_token
from datetime import timedelta


def register_user(db: Session, user_data: UserRegister) -> User:
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise ValueError("Email already registered")
    
    hashed_password = get_password_hash(user_data.password)
    db_user = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def authenticate_user(db: Session, user_data: UserLogin):
    user = db.query(User).filter(User.email == user_data.email).first()
    if not user:
        raise ValueError("Invalid credentials")
    
    if not verify_password(user_data.password, user.password_hash):
        raise ValueError("Invalid credentials")
    
    access_token = create_access_token(data={"sub": user.email})
    return user, access_token
