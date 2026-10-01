import os

os.environ.setdefault("CARDIFICATOR_DATABASE_URL", "sqlite://")
os.environ.setdefault("CARDIFICATOR_JWT_SECRET_KEY", "test-secret-key-at-least-32-bytes-long")

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.domain.entities import Role
from app.infrastructure.database import Base, get_db
from app.infrastructure.repositories import SqlAlchemyUserRepository
from app.main import create_app


@pytest.fixture()
def engine():
    test_engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(bind=test_engine)
    yield test_engine
    test_engine.dispose()


@pytest.fixture()
def session_factory(engine):
    return sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture()
def app(session_factory):
    application = create_app()

    def override_get_db():
        db = session_factory()
        try:
            yield db
            db.commit()
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    application.dependency_overrides[get_db] = override_get_db
    return application


@pytest.fixture()
def client(app):
    return TestClient(app)


def _register(client, username, password="password123"):
    resp = client.post(
        "/auth/register",
        json={
            "username": username,
            "email": f"{username}@example.com",
            "password": password,
        },
    )
    assert resp.status_code == 201, resp.text
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def _promote(session_factory, username, role):
    db = session_factory()
    try:
        users = SqlAlchemyUserRepository(db)
        user = users.get_by_username(username)
        user.role = role
        users.update(user)
        db.commit()
    finally:
        db.close()


@pytest.fixture()
def user_headers(client):
    return _register(client, "alice")


@pytest.fixture()
def other_user_headers(client):
    return _register(client, "bob")


@pytest.fixture()
def creator_headers(client, session_factory):
    headers = _register(client, "carol")
    _promote(session_factory, "carol", Role.CREATOR)
    return headers


@pytest.fixture()
def other_creator_headers(client, session_factory):
    headers = _register(client, "erin")
    _promote(session_factory, "erin", Role.CREATOR)
    return headers


@pytest.fixture()
def admin_headers(client, session_factory):
    headers = _register(client, "diana")
    _promote(session_factory, "diana", Role.ADMINISTRATOR)
    return headers
