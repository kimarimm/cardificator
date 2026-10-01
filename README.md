# Cardificator

Веб-приложение для коллекционирования карточек. Авторизованные создатели
выпускают наборы карточек (публичные или по приватной ссылке), пользователи
собирают карточки из этих наборов в свою библиотеку. Администраторы управляют
ролями пользователей и всеми наборами.

Состоит из двух частей:

- `server/` — backend на FastAPI + SQLAlchemy, JWT-авторизация
- `client/` — frontend на React + TypeScript + Vite + MUI

## Запуск

Нужен Docker и Docker Compose.

```bash
cp .env.example .env
# отредактировать .env: задать свои значения, особенно пароль БД и JWT-секрет
docker compose up -d --build
```

Приложение будет доступно на `http://127.0.0.1:8080` (порт задаётся
переменной `APP_PORT` в `.env`).

Создать первого администратора:

```bash
docker compose exec backend python -m app.cli create-admin \
  --username admin --email admin@example.com --password 'пароль'
```

## Тесты

Backend:

```bash
cd server
source .venv/bin/activate
pytest
```

Frontend:

```bash
cd client
npm install
npm run test:run
```

## Разработка

Backend (слушает `:8000`):

```bash
cd server
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # и отредактировать при необходимости
uvicorn app.main:app --reload
```

Frontend (слушает `:5173`, проксирует `/api` на `:8000`):

```bash
cd client
npm install
npm run dev
```

Интерактивная документация API доступна на `/docs` запущенного backend.
