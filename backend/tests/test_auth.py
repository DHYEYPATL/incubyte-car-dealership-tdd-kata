import pytest
from fastapi.testclient import TestClient


def test_register_user_success(client, db_session):
    """RED: A new user should be able to register with a username and password."""
    response = client.post(
        "/api/auth/register",
        json={"username": "admin", "password": "secret123", "role": "admin"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "admin"
    assert data["role"] == "admin"
    assert "password" not in data  # Password must never be returned


def test_register_duplicate_user_fails(client, db_session):
    """RED: Registering the same username twice should return 400."""
    # First registration
    response = client.post(
        "/api/auth/register",
        json={"username": "admin", "password": "secret123", "role": "admin"},
    )
    assert response.status_code == 201

    # Second registration with same username
    response = client.post(
        "/api/auth/register",
        json={"username": "admin", "password": "different", "role": "admin"},
    )
    assert response.status_code == 400
    assert "already" in response.json()["detail"].lower()
