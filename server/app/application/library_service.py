import secrets

from app.domain.entities import Card, CardSet, LibraryEntry, User
from app.domain.exceptions import ConflictError, NotFoundError, PermissionDeniedError
from app.domain.repositories import CardRepository, CardSetRepository, LibraryRepository


class LibraryService:
    def __init__(
        self,
        library_repository: LibraryRepository,
        card_repository: CardRepository,
        card_set_repository: CardSetRepository,
    ) -> None:
        self._library = library_repository
        self._cards = card_repository
        self._card_sets = card_set_repository

    def add_card(self, user: User, card_id: int, link_token: str | None) -> LibraryEntry:
        card = self.get_card(card_id)
        card_set = self._card_sets.get_by_id(card.set_id)
        if card_set is None:
            raise NotFoundError("Owning card set not found")
        self._ensure_access(card_set, link_token)
        if self._library.get(user.id, card_id) is not None:
            raise ConflictError("Card is already in your library")
        entry = LibraryEntry(id=None, user_id=user.id, card_id=card_id)
        return self._library.add(entry)

    def list_with_cards(self, user: User) -> list[tuple[LibraryEntry, Card]]:
        entries = self._library.list_by_user(user.id)
        return [(entry, self.get_card(entry.card_id)) for entry in entries]

    def remove_card(self, user: User, card_id: int) -> None:
        if self._library.get(user.id, card_id) is None:
            raise NotFoundError("Card is not in your library")
        self._library.delete(user.id, card_id)

    def get_card(self, card_id: int) -> Card:
        card = self._cards.get_by_id(card_id)
        if card is None:
            raise NotFoundError(f"Card {card_id} not found")
        return card

    @staticmethod
    def _ensure_access(card_set: CardSet, link_token: str | None) -> None:
        if card_set.is_public:
            return
        if link_token and secrets.compare_digest(link_token, card_set.link_token):
            return
        raise PermissionDeniedError("This card set is not public and no valid link was provided")
