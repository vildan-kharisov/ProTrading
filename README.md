## Минимальный пример: Next.js (App Router) + Prisma + NeonDB (PostgreSQL) для Vercel

Этот проект — минимальный рабочий пример:

- **Next.js 16 (App Router, TypeScript)**
- **Prisma** как ORM
- **NeonDB (PostgreSQL)** как база данных
- Готов к деплою на **Vercel**: все секреты через `env`, никаких лишних зависимостей

Модель `Note`:

- **id**: `uuid` (строка, PK)
- **title**: `string`
- **createdAt**: `DateTime` с дефолтом `now()`

Главная страница (`src/app/page.tsx`) делает запрос к БД через Prisma и отображает список заметок.

## Настройка окружения

### 1. Создайте базу данных в NeonDB

1. Зарегистрируйтесь на [Neon Console](https://console.neon.tech)
2. Создайте новый проект
3. Скопируйте строку подключения (Connection String) из панели управления

### 2. Создайте файл `.env` в корне проекта

Создайте файл `.env` в корне проекта (`C:\Work\ProTrading\.env`) со следующим содержимым:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxx-yyy.region.aws.neon.tech/neondb?sslmode=require"

# Auth.js (OAuth Google)
AUTH_SECRET="сгенерируйте: npx auth secret"
GOOGLE_CLIENT_ID="ваш Google OAuth Client ID"
GOOGLE_CLIENT_SECRET="ваш Google OAuth Client Secret"
```

Замените `USER`, `PASSWORD`, `ep-xxx-yyy`, `region` и `neondb` на ваши реальные значения из Neon Console.

Для входа через Google:
1. [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Credentials → Create Credentials → OAuth client ID.
2. Тип приложения: Web application.
3. Authorized redirect URIs: **точно** `http://localhost:3000/api/auth/callback/google` (для прода — `https://ваш-домен/api/auth/callback/google`).
4. Скопируйте Client ID и Client Secret в `.env`.

Если авторизация не срабатывает: проверьте, что AUTH_SECRET задан (`npx auth secret`), redirect URI в Google совпадает с вашим URL (порт 3000 или 3001).

**Важно:** Не коммитьте файл `.env` в репозиторий! Он уже должен быть в `.gitignore`.

## Команды (PowerShell, Windows)

Все команды выполняются из корня проекта (`C:\Work\ProTrading`):

- **Установка зависимостей** (если нужно переустановить):

```powershell
npm install
```

- **Генерация Prisma Client**:

```powershell
npm run prisma:generate
```

- **Применение миграции (создание таблицы `Note`)**:

```powershell
npm run prisma:migrate
```

- **Seed (создание минимальных данных `Note`)**:

```powershell
npm run prisma:seed
```

- **Запуск dev-сервера**:

```powershell
npm run dev
```

Открой `http://localhost:3000` — ты увидишь список заметок из PostgreSQL (Neon) или сообщение, что заметок пока нет.

## Деплой на Vercel

1. **Залей проект в репозиторий** (GitHub/GitLab/Bitbucket).
2. **Создай проект на Vercel**, указав этот репозиторий.
3. В настройках проекта на Vercel добавь переменную окружения:

   - **Name**: `DATABASE_URL`
   - **Value**: строка подключения к Neon (та же, что в локальном `.env`, но без кавычек).

4. Верифицируй, что билд прошёл успешно, и открой прод-URL Vercel — главная страница прочитает данные из Neon через Prisma.
