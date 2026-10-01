import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.application.auth_service import AuthService
from app.application.card_service import CardService
from app.application.card_set_service import CardSetService
from app.application.library_service import LibraryService
from app.application.user_service import UserService
from app.domain.entities import Role, User
from app.infrastructure.database import get_db
from app.infrastructure.repositories import (
    SqlAlchemyCardRepository,
    SqlAlchemyCardSetRepository,
    SqlAlchemyLibraryRepository,
    SqlAlchemyUserRepository,
)
from app.infrastructure.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_user_repository(db: Session = Depends(get_db)) -> SqlAlchemyUserRepository:
    return SqlAlchemyUserRepository(db)


def get_card_set_repository(db: Session = Depends(get_db)) -> SqlAlchemyCardSetRepository:
    return SqlAlchemyCardSetRepository(db)


def get_card_repository(db: Session = Depends(get_db)) -> SqlAlchemyCardRepository:
    return SqlAlchemyCardRepository(db)


def get_library_repository(db: Session = Depends(get_db)) -> SqlAlchemyLibraryRepository:
    return SqlAlchemyLibraryRepository(db)


def get_auth_service(
    users: SqlAlchemyUserRepository = Depends(get_user_repository),
) -> AuthService:
    return AuthService(users)


def get_user_service(
    users: SqlAlchemyUserRepository = Depends(get_user_repository),
) -> UserService:
    return UserService(users)


def get_card_set_service(
    card_sets: SqlAlchemyCardSetRepository = Depends(get_card_set_repository),
) -> CardSetService:
    return CardSetService(card_sets)


def get_card_service(
    cards: SqlAlchemyCardRepository = Depends(get_card_repository),
    card_set_service: CardSetService = Depends(get_card_set_service),
) -> CardService:
    return CardService(cards, card_set_service)


def get_library_service(
    library: SqlAlchemyLibraryRepository = Depends(get_library_repository),
    cards: SqlAlchemyCardRepository = Depends(get_card_repository),
    card_sets: SqlAlchemyCardSetRepository = Depends(get_card_set_repository),
) -> LibraryService:
    return LibraryService(library, cards, card_sets)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    users: SqlAlchemyUserRepository = Depends(get_user_repository),
) -> User:
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_access_token(token)
        user_id = int(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError) as exc:
        raise credentials_error from exc
    user = users.get_by_id(user_id)
    if user is None:
        raise credentials_error
    return user


def require_roles(*roles: Role):
    def dependency(user: User = Depends(get_current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action",
            )
        return user

    return dependency
