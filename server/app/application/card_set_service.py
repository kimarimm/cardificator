import secrets

from app.domain.entities import CardSet, Role, User
from app.domain.exceptions import NotFoundError, PermissionDeniedError
from app.domain.repositories import CardSetRepository


def _generate_link_token() -> str:
    return secrets.token_urlsafe(24)


class CardSetService:
    def __init__(self, card_set_repository: CardSetRepository) -> None:
        self._card_sets = card_set_repository

    def create(self, owner: User, name: str, description: str, is_public: bool) -> CardSet:
        card_set = CardSet(
            id=None,
            name=name,
            description=description,
            owner_id=owner.id,
            is_public=is_public,
            link_token=_generate_link_token(),
        )
        return self._card_sets.add(card_set)

    def list_for_user(self, user: User) -> list[CardSet]:
        if user.role == Role.ADMINISTRATOR:
            return self._card_sets.list_all()
        return self._card_sets.list_by_owner(user.id)

    def list_public(self) -> list[CardSet]:
        return self._card_sets.list_public()

    def get_by_link(self, token: str) -> CardSet:
        card_set = self._card_sets.get_by_link_token(token)
        if card_set is None:
            raise NotFoundError("No card set matches that link")
        return card_set

    def get_owned(self, user: User, set_id: int) -> CardSet:
        card_set = self._card_sets.get_by_id(set_id)
        if card_set is None:
            raise NotFoundError(f"Card set {set_id} not found")
        self._ensure_owner_or_admin(user, card_set)
        return card_set

    def update(
        self,
        user: User,
        set_id: int,
        name: str | None = None,
        description: str | None = None,
        is_public: bool | None = None,
    ) -> CardSet:
        card_set = self.get_owned(user, set_id)
        if name is not None:
            card_set.name = name
        if description is not None:
            card_set.description = description
        if is_public is not None:
            card_set.is_public = is_public
        return self._card_sets.update(card_set)

    def delete(self, user: User, set_id: int) -> None:
        card_set = self.get_owned(user, set_id)
        self._card_sets.delete(card_set.id)

    def regenerate_link(self, user: User, set_id: int) -> CardSet:
        card_set = self.get_owned(user, set_id)
        card_set.link_token = _generate_link_token()
        return self._card_sets.update(card_set)

    @staticmethod
    def _ensure_owner_or_admin(user: User, card_set: CardSet) -> None:
        if user.role != Role.ADMINISTRATOR and card_set.owner_id != user.id:
            raise PermissionDeniedError("You do not own this card set")
