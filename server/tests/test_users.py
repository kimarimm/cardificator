def test_list_users_requires_admin(client, user_headers):
    resp = client.get("/admin/users", headers=user_headers)
    assert resp.status_code == 403


def test_admin_can_list_users(client, admin_headers):
    resp = client.get("/admin/users", headers=admin_headers)
    assert resp.status_code == 200
    assert len(resp.json()) >= 1


def test_admin_can_promote_user_to_creator(client, admin_headers, user_headers):
    me = client.get("/users/me", headers=user_headers).json()
    resp = client.patch(
        f"/admin/users/{me['id']}/role", json={"role": "creator"}, headers=admin_headers
    )
    assert resp.status_code == 200
    assert resp.json()["role"] == "creator"


def test_admin_cannot_change_own_role(client, admin_headers):
    me = client.get("/users/me", headers=admin_headers).json()
    resp = client.patch(
        f"/admin/users/{me['id']}/role", json={"role": "user"}, headers=admin_headers
    )
    assert resp.status_code == 403


def test_non_admin_cannot_promote(client, user_headers, other_user_headers):
    target = client.get("/users/me", headers=other_user_headers).json()
    resp = client.patch(
        f"/admin/users/{target['id']}/role", json={"role": "creator"}, headers=user_headers
    )
    assert resp.status_code == 403
