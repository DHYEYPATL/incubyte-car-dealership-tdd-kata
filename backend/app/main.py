from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import Base, engine
from app.dependencies import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse
from app.auth import hash_password

app = FastAPI()

# Create tables on startup
Base.metadata.create_all(bind=engine)


@app.post("/api/auth/register", response_model=UserResponse, status_code=201)
def register(user: UserCreate, db: Session = Depends(get_db)):
    # Check for existing user
    existing = db.query(User).filter(User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")

    # Create new user
    db_user = User(
        username=user.username,
        hashed_password=hash_password(user.password),
        role=user.role,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
