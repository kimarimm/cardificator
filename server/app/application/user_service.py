from app.domain.entities import Role, User
from app.domain.exceptions import NotFoundError, PermissionDeniedError
from app.domain.repositories import UserRepository


class UserService:
    def __init__(self, user_repository: UserRepository) -> None:
        self._users = user_repository

    def list_users(self) -> list[User]:
        return self._users.list_all()

    def update_role(self, admin: User, target_user_id: int, new_role: Role) -> User:
        if admin.id == target_user_id:
            raise PermissionDeniedError("Administrators cannot change their own role")
        target = self._users.get_by_id(target_user_id)
        if target is None:
            raise NotFoundError(f"User {target_user_id} not found")
        target.role = new_role
        return self._users.update(target)
