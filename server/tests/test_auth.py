def test_register_returns_token(client):
    resp = client.post(
        "/auth/register",
        json={"username": "newuser", "email": "newuser@example.com", "password": "password123"},
    )
    assert resp.status_code == 201
    assert "access_token" in resp.json()


def test_register_duplicate_username_conflicts(client):
    client.post(
        "/auth/register",
        json={"username": "dup", "email": "a@example.com", "password": "password123"},
    )
    resp = client.post(
        "/auth/register",
        json={"username": "dup", "email": "b@example.com", "password": "password123"},
    )
    assert resp.status_code == 409


def test_register_duplicate_email_conflicts(client):
    client.post(
        "/auth/register",
        json={"username": "user1", "email": "same@example.com", "password": "password123"},
    )
    resp = client.post(
        "/auth/register",
        json={"username": "user2", "email": "same@example.com", "password": "password123"},
    )
    assert resp.status_code == 409


def test_login_success(client):
    client.post(
        "/auth/register",
        json={"username": "loginuser", "email": "login@example.com", "password": "password123"},
    )
    resp = client.post("/auth/login", data={"username": "loginuser", "password": "password123"})
    assert resp.status_code == 200
    assert "access_token" in resp.json()


def test_login_wrong_password_unauthorized(client):
    client.post(
        "/auth/register",
        json={"username": "wrongpass", "email": "wp@example.com", "password": "password123"},
    )
    resp = client.post("/auth/login", data={"username": "wrongpass", "password": "incorrect"})
    assert resp.status_code == 401


def test_me_requires_authentication(client):
    resp = client.get("/users/me")
    assert resp.status_code == 401


def test_me_returns_current_user(client, user_headers):
    resp = client.get("/users/me", headers=user_headers)
    assert resp.status_code == 200
    assert resp.json()["role"] == "user"
