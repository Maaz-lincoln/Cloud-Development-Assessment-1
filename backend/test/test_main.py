import pytest
from fastapi.testclient import TestClient
from main import app
from database import SessionLocal, engine, Base

@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    yield TestClient(app)
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def db():
    session = SessionLocal()
    yield session
    session.close()

@pytest.mark.asyncio
async def test_signup(client):
    response = client.post("/auth/signup", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    assert response.json()["username"] == "testuser"

@pytest.mark.asyncio
async def test_login(client):
    client.post("/auth/signup", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    })
    response = client.post("/auth/token", json={
        "username": "testuser",
        "password": "password123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "refresh_token" in response.json()

@pytest.mark.asyncio
async def test_refresh_token(client):
    signup_response = client.post("/auth/signup", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    })
    login_response = client.post("/auth/token", json={
        "username": "testuser",
        "password": "password123"
    })
    refresh_token = login_response.json()["refresh_token"]
    refresh_response = client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert refresh_response.status_code == 200
    assert "access_token" in refresh_response.json()

@pytest.mark.asyncio
async def test_submit_job(client):
    client.post("/auth/signup", json={
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    })
    login_response = client.post("/auth/token", json={
        "username": "testuser",
        "password": "password123"
    })
    access_token = login_response.json()["access_token"]
    response = client.post("/jobs/submit", json={"input_text": "This is a test text to summarize."}, headers={"Authorization": f"Bearer {access_token}"})
    assert response.status_code == 200
    assert response.json()["input_text"] == "This is a test text to summarize."