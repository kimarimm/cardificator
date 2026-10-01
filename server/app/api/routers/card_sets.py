from fastapi import APIRouter, Depends, status

from app.api.deps import get_card_service, get_card_set_service, get_current_user, require_roles
from app.api.schemas.card_set import (
    CardSetCreateRequest,
    CardSetDetailResponse,
    CardSetSummaryResponse,
    CardSetUpdateRequest,
    CardSetWithCardsResponse,
)
from app.application.card_service import CardService
from app.application.card_set_service import CardSetService
from app.domain.entities import Role, User

router = APIRouter(prefix="/sets", tags=["card sets"])


@router.post("", response_model=CardSetDetailResponse, status_code=status.HTTP_201_CREATED)
def create_set(
    body: CardSetCreateRequest,
    card_set_service: CardSetService = Depends(get_card_set_service),
    user: User = Depends(require_roles(Role.CREATOR, Role.ADMINISTRATOR)),
) -> CardSetDetailResponse:
    return card_set_service.create(user, body.name, body.description, body.is_public)


@router.get("", response_model=list[CardSetDetailResponse])
def list_sets(
    card_set_service: CardSetService = Depends(get_card_set_service),
    user: User = Depends(require_roles(Role.CREATOR, Role.ADMINISTRATOR)),
):
    return card_set_service.list_for_user(user)


@router.get("/public", response_model=list[CardSetWithCardsResponse])
def list_public_sets(
    card_set_service: CardSetService = Depends(get_card_set_service),
    card_service: CardService = Depends(get_card_service),
    _: User = Depends(get_current_user),
):
    sets = card_set_service.list_public()
    return [
        CardSetWithCardsResponse(
            id=s.id,
            name=s.name,
            description=s.description,
            is_public=s.is_public,
            cards=card_service.list_for_set_public(s.id),
        )
        for s in sets
    ]


@router.get("/by-link/{token}", response_model=CardSetWithCardsResponse)
def get_set_by_link(
    token: str,
    card_set_service: CardSetService = Depends(get_card_set_service),
    card_service: CardService = Depends(get_card_service),
    _: User = Depends(get_current_user),
):
    card_set = card_set_service.get_by_link(token)
    cards = card_service.list_for_set_public(card_set.id)
    return CardSetWithCardsResponse(
        id=card_set.id,
        name=card_set.name,
        description=card_set.description,
        is_public=card_set.is_public,
        cards=cards,
    )


@router.get("/{set_id}", response_model=CardSetDetailResponse)
def get_set(
    set_id: int,
    card_set_service: CardSetService = Depends(get_card_set_service),
    user: User = Depends(get_current_user),
):
    return card_set_service.get_owned(user, set_id)


@router.patch("/{set_id}", response_model=CardSetDetailResponse)
def update_set(
    set_id: int,
    body: CardSetUpdateRequest,
    card_set_service: CardSetService = Depends(get_card_set_service),
    user: User = Depends(get_current_user),
):
    return card_set_service.update(user, set_id, **body.model_dump(exclude_unset=True))


@router.delete("/{set_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_set(
    set_id: int,
    card_set_service: CardSetService = Depends(get_card_set_service),
    user: User = Depends(get_current_user),
):
    card_set_service.delete(user, set_id)


@router.post("/{set_id}/link/regenerate", response_model=CardSetDetailResponse)
def regenerate_link(
    set_id: int,
    card_set_service: CardSetService = Depends(get_card_set_service),
    user: User = Depends(get_current_user),
):
    return card_set_service.regenerate_link(user, set_id)
