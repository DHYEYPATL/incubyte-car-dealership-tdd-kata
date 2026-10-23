from fastapi import FastAPI

from app.database import Base, engine
from app.routers.auth import router as auth_router

app = FastAPI()

# Create tables on startup
Base.metadata.create_all(bind=engine)

# Register routers
app.include_router(auth_router)
