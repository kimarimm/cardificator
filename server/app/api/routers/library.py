from fastapi import APIRouter, Depends, status

from app.api.deps import get_current_user, get_library_service
from app.api.schemas.library import LibraryAddRequest, LibraryEntryResponse
from app.application.library_service import LibraryService
from app.domain.entities import User

router = APIRouter(prefix="/library", tags=["library"])


@router.get("", response_model=list[LibraryEntryResponse])
def list_library(
    library_service: LibraryService = Depends(get_library_service),
    user: User = Depends(get_current_user),
):
    return [
        LibraryEntryResponse(card=card, added_at=entry.added_at)
        for entry, card in library_service.list_with_cards(user)
    ]


@router.post("", response_model=LibraryEntryResponse, status_code=status.HTTP_201_CREATED)
def add_to_library(
    body: LibraryAddRequest,
    library_service: LibraryService = Depends(get_library_service),
    user: User = Depends(get_current_user),
):
    entry = library_service.add_card(user, body.card_id, body.link_token)
    card = library_service.get_card(entry.card_id)
    return LibraryEntryResponse(card=card, added_at=entry.added_at)


@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_library(
    card_id: int,
    library_service: LibraryService = Depends(get_library_service),
    user: User = Depends(get_current_user),
):
    library_service.remove_card(user, card_id)
