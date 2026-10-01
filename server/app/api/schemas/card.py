import re

from pydantic import BaseModel, ConfigDict, Field, field_validator

_HEX_COLOR_RE = re.compile(r"^#[0-9A-Fa-f]{6}$")


def _validate_color(value: str | None) -> str | None:
    if value is not None and not _HEX_COLOR_RE.match(value):
        raise ValueError("color must be a hex code like #A1B2C3")
    return value


class CardBase(BaseModel):
    name: str = Field(min_length=1, max_length=128)
    symbol: str = Field(min_length=1, max_length=16)
    color: str
    description: str = Field(default="", max_length=1024)

    _check_color = field_validator("color")(_validate_color)


class CardCreateRequest(CardBase):
    pass


class CardUpdateRequest(BaseModel):
    name: str | None = Field(default=None, min_length=1, max_length=128)
    symbol: str | None = Field(default=None, min_length=1, max_length=16)
    color: str | None = None
    description: str | None = Field(default=None, max_length=1024)

    _check_color = field_validator("color")(_validate_color)


class CardResponse(CardBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    set_id: int
