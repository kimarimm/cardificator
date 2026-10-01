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


def test_owner_can_crud_cards(client, creator_headers):
    card_set = _create_set(client, creator_headers)
    card = _create_card(client, creator_headers, card_set["id"])

    resp = client.get(f"/sets/{card_set['id']}/cards", headers=creator_headers)
    assert resp.status_code == 200
    assert len(resp.json()) == 1

    resp = client.patch(
        f"/sets/{card_set['id']}/cards/{card['id']}",
        json={"name": "Ice Bolt"},
        headers=creator_headers,
    )
    assert resp.status_code == 200
    assert resp.json()["name"] == "Ice Bolt"

    resp = client.delete(f"/sets/{card_set['id']}/cards/{card['id']}", headers=creator_headers)
    assert resp.status_code == 204


def test_non_owner_cannot_manage_cards(client, creator_headers, other_creator_headers):
    card_set = _create_set(client, creator_headers)
    resp = client.post(
        f"/sets/{card_set['id']}/cards",
        json={"name": "X", "symbol": "X", "color": "#000000", "description": ""},
        headers=other_creator_headers,
    )
    assert resp.status_code == 403


def test_invalid_color_rejected(client, creator_headers):
    card_set = _create_set(client, creator_headers)
    resp = client.post(
        f"/sets/{card_set['id']}/cards",
        json={"name": "X", "symbol": "X", "color": "not-a-color", "description": ""},
        headers=creator_headers,
    )
    assert resp.status_code == 422
