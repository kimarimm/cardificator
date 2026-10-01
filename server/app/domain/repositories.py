from __future__ import annotations

from abc import ABC, abstractmethod

from app.domain.entities import Card, CardSet, LibraryEntry, User


class UserRepository(ABC):
    @abstractmethod
    def add(self, user: User) -> User: ...

    @abstractmethod
    def get_by_id(self, user_id: int) -> User | None: ...

    @abstractmethod
    def get_by_username(self, username: str) -> User | None: ...

    @abstractmethod
    def get_by_email(self, email: str) -> User | None: ...

    @abstractmethod
    def list_all(self) -> list[User]: ...

    @abstractmethod
    def update(self, user: User) -> User: ...


class CardSetRepository(ABC):
    @abstractmethod
    def add(self, card_set: CardSet) -> CardSet: ...

    @abstractmethod
    def get_by_id(self, set_id: int) -> CardSet | None: ...

    @abstractmethod
    def get_by_link_token(self, token: str) -> CardSet | None: ...

    @abstractmethod
    def list_by_owner(self, owner_id: int) -> list[CardSet]: ...

    @abstractmethod
    def list_public(self) -> list[CardSet]: ...

    @abstractmethod
    def list_all(self) -> list[CardSet]: ...

    @abstractmethod
    def update(self, card_set: CardSet) -> CardSet: ...

    @abstractmethod
    def delete(self, set_id: int) -> None: ...


class CardRepository(ABC):
    @abstractmethod
    def add(self, card: Card) -> Card: ...

    @abstractmethod
    def get_by_id(self, card_id: int) -> Card | None: ...

    @abstractmethod
    def list_by_set(self, set_id: int) -> list[Card]: ...

    @abstractmethod
    def update(self, card: Card) -> Card: ...

    @abstractmethod
    def delete(self, card_id: int) -> None: ...


class LibraryRepository(ABC):
    @abstractmethod
    def add(self, entry: LibraryEntry) -> LibraryEntry: ...

    @abstractmethod
    def get(self, user_id: int, card_id: int) -> LibraryEntry | None: ...

    @abstractmethod
    def list_by_user(self, user_id: int) -> list[LibraryEntry]: ...

    @abstractmethod
    def delete(self, user_id: int, card_id: int) -> None: ...
