import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers.auth import router as auth_router
from app.routers.vehicles import router as vehicles_router

app = FastAPI(title="Incubyte Car Dealership API")

# Configure CORS origins
cors_origins_env = os.environ.get("ALLOWED_ORIGINS", "")
allowed_origins = [o.strip() for o in cors_origins_env.split(",") if o.strip()]

for default_origin in [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]:
    if default_origin not in allowed_origins:
        allowed_origins.append(default_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables on startup
Base.metadata.create_all(bind=engine)

if os.environ.get("AUTO_SEED", "").lower() in ("true", "1", "yes"):
    from app.seed import seed_database
    seed_database()


@app.get("/", tags=["health"])
def root():
    return {
        "status": "online",
        "service": "Incubyte Car Dealership API",
        "docs": "/docs",
    }


@app.get("/health", tags=["health"])
@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok"}



# Register routers
app.include_router(auth_router)
app.include_router(vehicles_router)

