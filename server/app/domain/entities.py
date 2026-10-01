from __future__ import annotations

import enum
from dataclasses import dataclass
from datetime import datetime


class Role(str, enum.Enum):
    USER = "user"
    CREATOR = "creator"
    ADMINISTRATOR = "administrator"


@dataclass
class User:
    id: int | None
    username: str
    email: str
    hashed_password: str
    role: Role
    created_at: datetime | None = None


@dataclass
class CardSet:
    id: int | None
    name: str
    description: str
    owner_id: int
    is_public: bool
    link_token: str
    created_at: datetime | None = None


@dataclass
class Card:
    id: int | None
    set_id: int
    name: str
    symbol: str
    color: str
    description: str = ""


@dataclass
class LibraryEntry:
    id: int | None
    user_id: int
    card_id: int
    added_at: datetime | None = None
