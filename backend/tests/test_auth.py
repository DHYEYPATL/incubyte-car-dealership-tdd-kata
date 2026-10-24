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


def test_login_success_returns_jwt(client, db_session):
    """RED: Successful login should return a JWT access token."""
    # First, register a user
    client.post(
        "/api/auth/register",
        json={"username": "admin", "password": "secret123", "role": "admin"},
    )

    # Then, attempt login
    response = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "secret123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password_returns_401(client, db_session):
    """RED: Login with wrong password should return 401."""
    client.post(
        "/api/auth/register",
        json={"username": "admin", "password": "secret123", "role": "admin"},
    )

    response = client.post(
        "/api/auth/login",
        json={"username": "admin", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_login_nonexistent_user_returns_401(client, db_session):
    """RED: Login with a username that doesn't exist should return 401."""
    response = client.post(
        "/api/auth/login",
        json={"username": "ghost", "password": "secret123"},
    )
    assert response.status_code == 401


def test_jwt_secret_is_configurable_via_env(monkeypatch):
    """RED: Token signed with env secret must fail validation if secret changes."""
    import importlib
    from app import auth

    # Create a token with the current (hardcoded) secret
    token_with_old_secret = auth.create_access_token({"sub": "alice", "role": "user"})

    # Change the env secret and reload the module
    monkeypatch.setenv("SECRET_KEY", "completely-different-secret")
    importlib.reload(auth)

    # Token signed with old secret should now fail to decode
    from jose import JWTError
    try:
        auth.decode_access_token(token_with_old_secret)
        assert False, "Should have raised JWTError"
    except JWTError:
        pass  # expected

    # Restore
    importlib.reload(auth)
