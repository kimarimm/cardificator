from pydantic import BaseModel, ConfigDict

from app.domain.entities import Role


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str
    role: Role


class RoleUpdateRequest(BaseModel):
    role: Role
