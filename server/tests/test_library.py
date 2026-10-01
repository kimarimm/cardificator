def _create_set(client, headers, name="Set A", is_public=False):
    resp = client.post(
        "/sets",
        json={"name": name, "description": "desc", "is_public": is_public},
        headers=headers,
    )
    assert resp.status_code == 201, resp.text
    return resp.json()


def _create_card(client, headers, set_id, name="Fireball"):
    resp = client.post(
        f"/sets/{set_id}/cards",
        json={"name": name, "symbol": "\U0001F525", "color": "#FF0000", "description": "burns"},
        headers=headers,
    )
    assert resp.status_code == 201, resp.text
    return resp.json()


def test_add_card_from_public_set(client, creator_headers, user_headers):
    card_set = _create_set(client, creator_headers, is_public=True)
    card = _create_card(client, creator_headers, card_set["id"])

    resp = client.post("/library", json={"card_id": card["id"]}, headers=user_headers)
    assert resp.status_code == 201

    resp = client.get("/library", headers=user_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1


def test_add_card_from_private_set_without_token_forbidden(client, creator_headers, user_headers):
    card_set = _create_set(client, creator_headers, is_public=False)
    card = _create_card(client, creator_headers, card_set["id"])

    resp = client.post("/library", json={"card_id": card["id"]}, headers=user_headers)
    assert resp.status_code == 403


def test_add_card_from_private_set_with_token_succeeds(client, creator_headers, user_headers):
    card_set = _create_set(client, creator_headers, is_public=False)
    card = _create_card(client, creator_headers, card_set["id"])
    detail = client.get(f"/sets/{card_set['id']}", headers=creator_headers).json()

    resp = client.post(
        "/library",
        json={"card_id": card["id"], "link_token": detail["link_token"]},
        headers=user_headers,
    )
    assert resp.status_code == 201


def test_add_duplicate_card_conflicts(client, creator_headers, user_headers):
    card_set = _create_set(client, creator_headers, is_public=True)
    card = _create_card(client, creator_headers, card_set["id"])

    client.post("/library", json={"card_id": card["id"]}, headers=user_headers)
    resp = client.post("/library", json={"card_id": card["id"]}, headers=user_headers)
    assert resp.status_code == 409


def test_remove_card_from_library(client, creator_headers, user_headers):
    card_set = _create_set(client, creator_headers, is_public=True)
    card = _create_card(client, creator_headers, card_set["id"])
    client.post("/library", json={"card_id": card["id"]}, headers=user_headers)

    resp = client.delete(f"/library/{card['id']}", headers=user_headers)
    assert resp.status_code == 204

    resp = client.get("/library", headers=user_headers)
    assert resp.json() == []
