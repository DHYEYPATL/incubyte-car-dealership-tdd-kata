import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.main import app
from fastapi.testclient import TestClient


@pytest.fixture
def engine():
    """Create a fresh SQLite database for each test session."""
    engine = create_engine("sqlite:///./test.db", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    yield engine
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def db_session(engine):
    """Create a fresh database session for each test."""
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)
