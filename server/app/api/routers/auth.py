from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

from app.api.deps import get_auth_service
from app.api.schemas.auth import RegisterRequest, TokenResponse
from app.application.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(
    body: RegisterRequest, auth_service: AuthService = Depends(get_auth_service)
) -> TokenResponse:
    _, token = auth_service.register(body.username, body.email, body.password)
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    auth_service: AuthService = Depends(get_auth_service),
) -> TokenResponse:
    _, token = auth_service.authenticate(form_data.username, form_data.password)
    return TokenResponse(access_token=token)
