from fastapi import APIRouter, Depends, status

from app.api.deps import get_card_service, get_current_user
from app.api.schemas.card import CardCreateRequest, CardResponse, CardUpdateRequest
from app.application.card_service import CardService
from app.domain.entities import User

router = APIRouter(prefix="/sets/{set_id}/cards", tags=["cards"])


@router.get("", response_model=list[CardResponse])
def list_cards(
    set_id: int,
    card_service: CardService = Depends(get_card_service),
    user: User = Depends(get_current_user),
):
    return card_service.list_for_set(user, set_id)


@router.post("", response_model=CardResponse, status_code=status.HTTP_201_CREATED)
def create_card(
    set_id: int,
    body: CardCreateRequest,
    card_service: CardService = Depends(get_card_service),
    user: User = Depends(get_current_user),
):
    return card_service.create(user, set_id, body.name, body.symbol, body.color, body.description)


@router.get("/{card_id}", response_model=CardResponse)
def get_card(
    set_id: int,
    card_id: int,
    card_service: CardService = Depends(get_card_service),
    user: User = Depends(get_current_user),
):
    return card_service.get(user, set_id, card_id)


@router.patch("/{card_id}", response_model=CardResponse)
def update_card(
    set_id: int,
    card_id: int,
    body: CardUpdateRequest,
    card_service: CardService = Depends(get_card_service),
    user: User = Depends(get_current_user),
):
    return card_service.update(user, set_id, card_id, **body.model_dump(exclude_unset=True))


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_card(
    set_id: int,
    card_id: int,
    card_service: CardService = Depends(get_card_service),
    user: User = Depends(get_current_user),
):
    card_service.delete(user, set_id, card_id)
