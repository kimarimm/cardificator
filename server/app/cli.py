import argparse

from app.domain.entities import Role, User
from app.infrastructure.database import SessionLocal, init_db
from app.infrastructure.repositories import SqlAlchemyUserRepository
from app.infrastructure.security import hash_password


def create_admin(username: str, email: str, password: str) -> None:
    init_db()
    db = SessionLocal()
    try:
        users = SqlAlchemyUserRepository(db)
        existing = users.get_by_username(username) or users.get_by_email(email)
        if existing is not None:
            existing.role = Role.ADMINISTRATOR
            users.update(existing)
            db.commit()
            print(f"Promoted existing user '{existing.username}' to administrator")
            return
        user = User(
            id=None,
            username=username,
            email=email,
            hashed_password=hash_password(password),
            role=Role.ADMINISTRATOR,
        )
        users.add(user)
        db.commit()
        print(f"Created administrator '{username}'")
    finally:
        db.close()


def main() -> None:
    parser = argparse.ArgumentParser(prog="python -m app.cli")
    subparsers = parser.add_subparsers(dest="command", required=True)

    create_admin_parser = subparsers.add_parser(
        "create-admin", help="Create a new administrator, or promote an existing user"
    )
    create_admin_parser.add_argument("--username", required=True)
    create_admin_parser.add_argument("--email", required=True)
    create_admin_parser.add_argument("--password", required=True)

    args = parser.parse_args()

    if args.command == "create-admin":
        create_admin(args.username, args.email, args.password)


if __name__ == "__main__":
    main()
