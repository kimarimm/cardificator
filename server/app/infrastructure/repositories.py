from sqlalchemy import select
from sqlalchemy.orm import Session

from app.domain.entities import Card, CardSet, LibraryEntry, Role, User
from app.domain.repositories import (
    CardRepository,
    CardSetRepository,
    LibraryRepository,
    UserRepository,
)
from app.infrastructure.models import CardModel, CardSetModel, LibraryEntryModel, UserModel


def _user_to_domain(model: UserModel) -> User:
    return User(
        id=model.id,
        username=model.username,
        email=model.email,
        hashed_password=model.hashed_password,
        role=Role(model.role),
        created_at=model.created_at,
    )


def _card_set_to_domain(model: CardSetModel) -> CardSet:
    return CardSet(
        id=model.id,
        name=model.name,
        description=model.description,
        owner_id=model.owner_id,
        is_public=model.is_public,
        link_token=model.link_token,
        created_at=model.created_at,
    )


def _card_to_domain(model: CardModel) -> Card:
    return Card(
        id=model.id,
        set_id=model.set_id,
        name=model.name,
        symbol=model.symbol,
        color=model.color,
        description=model.description,
    )


def _library_entry_to_domain(model: LibraryEntryModel) -> LibraryEntry:
    return LibraryEntry(
        id=model.id,
        user_id=model.user_id,
        card_id=model.card_id,
        added_at=model.added_at,
    )


class SqlAlchemyUserRepository(UserRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    def add(self, user: User) -> User:
        model = UserModel(
            username=user.username,
            email=user.email,
            hashed_password=user.hashed_password,
            role=user.role.value,
        )
        self._session.add(model)
        self._session.flush()
        return _user_to_domain(model)

    def get_by_id(self, user_id: int) -> User | None:
        model = self._session.get(UserModel, user_id)
        return _user_to_domain(model) if model else None

    def get_by_username(self, username: str) -> User | None:
        model = self._session.scalar(select(UserModel).where(UserModel.username == username))
        return _user_to_domain(model) if model else None

    def get_by_email(self, email: str) -> User | None:
        model = self._session.scalar(select(UserModel).where(UserModel.email == email))
        return _user_to_domain(model) if model else None

    def list_all(self) -> list[User]:
        models = self._session.scalars(select(UserModel)).all()
        return [_user_to_domain(m) for m in models]

    def update(self, user: User) -> User:
        model = self._session.get(UserModel, user.id)
        model.role = user.role.value
        self._session.flush()
        return _user_to_domain(model)


class SqlAlchemyCardSetRepository(CardSetRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    def add(self, card_set: CardSet) -> CardSet:
        model = CardSetModel(
            name=card_set.name,
            description=card_set.description,
            owner_id=card_set.owner_id,
            is_public=card_set.is_public,
            link_token=card_set.link_token,
        )
        self._session.add(model)
        self._session.flush()
        return _card_set_to_domain(model)

    def get_by_id(self, set_id: int) -> CardSet | None:
        model = self._session.get(CardSetModel, set_id)
        return _card_set_to_domain(model) if model else None

    def get_by_link_token(self, token: str) -> CardSet | None:
        model = self._session.scalar(select(CardSetModel).where(CardSetModel.link_token == token))
        return _card_set_to_domain(model) if model else None

    def list_by_owner(self, owner_id: int) -> list[CardSet]:
        models = self._session.scalars(
            select(CardSetModel).where(CardSetModel.owner_id == owner_id)
        ).all()
        return [_card_set_to_domain(m) for m in models]

    def list_public(self) -> list[CardSet]:
        models = self._session.scalars(
            select(CardSetModel).where(CardSetModel.is_public.is_(True))
        ).all()
        return [_card_set_to_domain(m) for m in models]

    def list_all(self) -> list[CardSet]:
        models = self._session.scalars(select(CardSetModel)).all()
        return [_card_set_to_domain(m) for m in models]

    def update(self, card_set: CardSet) -> CardSet:
        model = self._session.get(CardSetModel, card_set.id)
        model.name = card_set.name
        model.description = card_set.description
        model.is_public = card_set.is_public
        model.link_token = card_set.link_token
        self._session.flush()
        return _card_set_to_domain(model)

    def delete(self, set_id: int) -> None:
        model = self._session.get(CardSetModel, set_id)
        if model is not None:
            self._session.delete(model)
            self._session.flush()


class SqlAlchemyCardRepository(CardRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    def add(self, card: Card) -> Card:
        model = CardModel(
            set_id=card.set_id,
            name=card.name,
            symbol=card.symbol,
            color=card.color,
            description=card.description,
        )
        self._session.add(model)
        self._session.flush()
        return _card_to_domain(model)

    def get_by_id(self, card_id: int) -> Card | None:
        model = self._session.get(CardModel, card_id)
        return _card_to_domain(model) if model else None

    def list_by_set(self, set_id: int) -> list[Card]:
        models = self._session.scalars(select(CardModel).where(CardModel.set_id == set_id)).all()
        return [_card_to_domain(m) for m in models]

    def update(self, card: Card) -> Card:
        model = self._session.get(CardModel, card.id)
        model.name = card.name
        model.symbol = card.symbol
        model.color = card.color
        model.description = card.description
        self._session.flush()
        return _card_to_domain(model)

    def delete(self, card_id: int) -> None:
        model = self._session.get(CardModel, card_id)
        if model is not None:
            self._session.delete(model)
            self._session.flush()


class SqlAlchemyLibraryRepository(LibraryRepository):
    def __init__(self, session: Session) -> None:
        self._session = session

    def add(self, entry: LibraryEntry) -> LibraryEntry:
        model = LibraryEntryModel(user_id=entry.user_id, card_id=entry.card_id)
        self._session.add(model)
        self._session.flush()
        return _library_entry_to_domain(model)

    def get(self, user_id: int, card_id: int) -> LibraryEntry | None:
        model = self._session.scalar(
            select(LibraryEntryModel).where(
                LibraryEntryModel.user_id == user_id, LibraryEntryModel.card_id == card_id
            )
        )
        return _library_entry_to_domain(model) if model else None

    def list_by_user(self, user_id: int) -> list[LibraryEntry]:
        models = self._session.scalars(
            select(LibraryEntryModel).where(LibraryEntryModel.user_id == user_id)
        ).all()
        return [_library_entry_to_domain(m) for m in models]

    def delete(self, user_id: int, card_id: int) -> None:
        model = self._session.scalar(
            select(LibraryEntryModel).where(
                LibraryEntryModel.user_id == user_id, LibraryEntryModel.card_id == card_id
            )
        )
        if model is not None:
            self._session.delete(model)
            self._session.flush()
