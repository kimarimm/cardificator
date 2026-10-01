from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.domain.entities import Role
from app.infrastructure.database import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class UserModel(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    role: Mapped[str] = mapped_column(String(32), default=Role.USER.value)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)


class CardSetModel(Base):
    __tablename__ = "card_sets"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(128))
    description: Mapped[str] = mapped_column(String(1024), default="")
    owner_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    is_public: Mapped[bool] = mapped_column(default=False)
    link_token: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)

    cards: Mapped[list["CardModel"]] = relationship(
        back_populates="card_set", cascade="all, delete-orphan"
    )


class CardModel(Base):
    __tablename__ = "cards"

    id: Mapped[int] = mapped_column(primary_key=True)
    set_id: Mapped[int] = mapped_column(ForeignKey("card_sets.id"))
    name: Mapped[str] = mapped_column(String(128))
    symbol: Mapped[str] = mapped_column(String(16))
    color: Mapped[str] = mapped_column(String(7))
    description: Mapped[str] = mapped_column(String(1024), default="")

    card_set: Mapped["CardSetModel"] = relationship(back_populates="cards")


class LibraryEntryModel(Base):
    __tablename__ = "library_entries"
    __table_args__ = (UniqueConstraint("user_id", "card_id", name="uq_library_user_card"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    card_id: Mapped[int] = mapped_column(ForeignKey("cards.id"))
    added_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=_utcnow)
