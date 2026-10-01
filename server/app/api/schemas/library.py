from datetime import datetime

from pydantic import BaseModel

from app.api.schemas.card import CardResponse


class LibraryAddRequest(BaseModel):
    card_id: int
    link_token: str | None = None


class LibraryEntryResponse(BaseModel):
    card: CardResponse
    added_at: datetime
