def _create_set(client, headers, name="Set A", is_public=False):
    resp = client.post(
        "/sets",
        json={"name": name, "description": "desc", "is_public": is_public},
        headers=headers,
    )
    assert resp.status_code == 201, resp.text
    return resp.json()


def test_user_cannot_create_set(client, user_headers):
    resp = client.post("/sets", json={"name": "X", "description": ""}, headers=user_headers)
    assert resp.status_code == 403


def test_creator_can_create_and_list_own_sets(client, creator_headers):
    _create_set(client, creator_headers, "Set A")
    resp = client.get("/sets", headers=creator_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_admin_can_view_any_set(client, creator_headers, admin_headers):
    created = _create_set(client, creator_headers, "Private")
    resp = client.get(f"/sets/{created['id']}", headers=admin_headers)
    assert resp.status_code == 200


def test_other_creator_cannot_view_set(client, creator_headers, other_creator_headers):
    created = _create_set(client, creator_headers, "Private")
    resp = client.get(f"/sets/{created['id']}", headers=other_creator_headers)
    assert resp.status_code == 403


def test_owner_can_update_and_delete_set(client, creator_headers):
    created = _create_set(client, creator_headers, "To Update")
    resp = client.patch(
        f"/sets/{created['id']}", json={"name": "Renamed"}, headers=creator_headers
    )
    assert resp.status_code == 200
    assert resp.json()["name"] == "Renamed"

    resp = client.delete(f"/sets/{created['id']}", headers=creator_headers)
    assert resp.status_code == 204

    resp = client.get(f"/sets/{created['id']}", headers=creator_headers)
    assert resp.status_code == 404


def test_public_sets_are_discoverable(client, creator_headers, user_headers):
    _create_set(client, creator_headers, "Public Set", is_public=True)
    _create_set(client, creator_headers, "Private Set", is_public=False)

    resp = client.get("/sets/public", headers=user_headers)
    assert resp.status_code == 200
    names = [s["name"] for s in resp.json()]
    assert "Public Set" in names
    assert "Private Set" not in names


def test_get_set_by_link_token(client, creator_headers, user_headers):
    created = _create_set(client, creator_headers, "Linked Set")
    detail = client.get(f"/sets/{created['id']}", headers=creator_headers).json()
    token = detail["link_token"]

    resp = client.get(f"/sets/by-link/{token}", headers=user_headers)
    assert resp.status_code == 200
    assert resp.json()["name"] == "Linked Set"


def test_get_set_by_wrong_link_token_not_found(client, user_headers):
    resp = client.get("/sets/by-link/not-a-real-token", headers=user_headers)
    assert resp.status_code == 404


def test_regenerate_link_changes_token(client, creator_headers):
    created = _create_set(client, creator_headers, "Rotating")
    old_token = created["link_token"]
    resp = client.post(f"/sets/{created['id']}/link/regenerate", headers=creator_headers)
    assert resp.status_code == 200
    assert resp.json()["link_token"] != old_token
