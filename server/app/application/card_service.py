from app.application.card_set_service import CardSetService
from app.domain.entities import Card, User
from app.domain.exceptions import NotFoundError
from app.domain.repositories import CardRepository


class CardService:
    def __init__(self, card_repository: CardRepository, card_set_service: CardSetService) -> None:
        self._cards = card_repository
        self._card_sets = card_set_service

    def list_for_set(self, user: User, set_id: int) -> list[Card]:
        self._card_sets.get_owned(user, set_id)
        return self._cards.list_by_set(set_id)

    def list_for_set_public(self, set_id: int) -> list[Card]:
        return self._cards.list_by_set(set_id)

    def create(
        self, user: User, set_id: int, name: str, symbol: str, color: str, description: str
    ) -> Card:
        self._card_sets.get_owned(user, set_id)
        card = Card(
            id=None,
            set_id=set_id,
            name=name,
            symbol=symbol,
            color=color,
            description=description,
        )
        return self._cards.add(card)

    def get(self, user: User, set_id: int, card_id: int) -> Card:
        self._card_sets.get_owned(user, set_id)
        card = self._cards.get_by_id(card_id)
        if card is None or card.set_id != set_id:
            raise NotFoundError(f"Card {card_id} not found in set {set_id}")
        return card

    def update(
        self,
        user: User,
        set_id: int,
        card_id: int,
        name: str | None = None,
        symbol: str | None = None,
        color: str | None = None,
        description: str | None = None,
    ) -> Card:
        card = self.get(user, set_id, card_id)
        if name is not None:
            card.name = name
        if symbol is not None:
            card.symbol = symbol
        if color is not None:
            card.color = color
        if description is not None:
            card.description = description
        return self._cards.update(card)

    def delete(self, user: User, set_id: int, card_id: int) -> None:
        card = self.get(user, set_id, card_id)
        self._cards.delete(card.id)
