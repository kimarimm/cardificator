from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.api.schemas.card import CardResponse


class CardSetCreateRequest(BaseModel):
    name: str = Field(min_length=1, max_length=128)
    description: str = Field(default="", max_length=1024)
    is_public: bool = False


class CardSetUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=128)
    description: str | None = Field(default=None, max_length=1024)
    is_public: bool | None = None


class CardSetSummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str
    is_public: bool


class CardSetDetailResponse(CardSetSummaryResponse):
    owner_id: int
    link_token: str
    created_at: datetime


class CardSetWithCardsResponse(CardSetSummaryResponse):
    cards: list[CardResponse]
