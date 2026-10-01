from app.domain.entities import Role, User
from app.domain.exceptions import AuthenticationError, ConflictError
from app.domain.repositories import UserRepository
from app.infrastructure.security import create_access_token, hash_password, verify_password


class AuthService:
    def __init__(self, user_repository: UserRepository) -> None:
        self._users = user_repository

    def register(self, username: str, email: str, password: str) -> tuple[User, str]:
        if self._users.get_by_username(username):
            raise ConflictError(f"Username '{username}' is already taken")
        if self._users.get_by_email(email):
            raise ConflictError(f"Email '{email}' is already registered")
        user = User(
            id=None,
            username=username,
            email=email,
            hashed_password=hash_password(password),
            role=Role.USER,
        )
        created = self._users.add(user)
        return created, create_access_token(created)

    def authenticate(self, username: str, password: str) -> tuple[User, str]:
        user = self._users.get_by_username(username)
        if user is None or not verify_password(password, user.hashed_password):
            raise AuthenticationError("Invalid username or password")
        return user, create_access_token(user)
