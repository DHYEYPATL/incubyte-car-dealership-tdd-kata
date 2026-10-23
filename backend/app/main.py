from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import Base, engine
from app.dependencies import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse, LoginRequest, TokenResponse
from app.auth import hash_password, verify_password, create_access_token

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


@app.post("/api/auth/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    # Find user by username
    user = db.query(User).filter(User.username == credentials.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Verify password
    if not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Generate JWT token
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role}
    )
    return TokenResponse(access_token=access_token, token_type="bearer")
