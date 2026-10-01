from fastapi import APIRouter, Depends

from app.api.deps import get_current_user, get_user_service, require_roles
from app.api.schemas.user import RoleUpdateRequest, UserResponse
from app.application.user_service import UserService
from app.domain.entities import Role, User

router = APIRouter(tags=["users"])


@router.get("/users/me", response_model=UserResponse)
def get_me(user: User = Depends(get_current_user)) -> User:
    return user


@router.get("/admin/users", response_model=list[UserResponse])
def list_users(
    user_service: UserService = Depends(get_user_service),
    _: User = Depends(require_roles(Role.ADMINISTRATOR)),
) -> list[User]:
    return user_service.list_users()


@router.patch("/admin/users/{user_id}/role", response_model=UserResponse)
def update_role(
    user_id: int,
    body: RoleUpdateRequest,
    user_service: UserService = Depends(get_user_service),
    admin: User = Depends(require_roles(Role.ADMINISTRATOR)),
) -> User:
    return user_service.update_role(admin, user_id, body.role)
