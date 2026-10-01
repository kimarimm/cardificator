from fastapi import FastAPI

from app.api.routers import auth, card_sets, cards, library, users
from app.infrastructure.database import init_db
from app.middleware.error_handling import ErrorHandlingMiddleware


def create_app() -> FastAPI:
    init_db()

    app = FastAPI(title="Cardificator API")
    app.add_middleware(ErrorHandlingMiddleware)

    app.include_router(auth.router)
    app.include_router(users.router)
    app.include_router(card_sets.router)
    app.include_router(cards.router)
    app.include_router(library.router)

    return app


app = create_app()
