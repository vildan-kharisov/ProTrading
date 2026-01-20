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

Создай файл `.env` в корне проекта (`pro-trading/.env`) по примеру:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require"
```

Пример для Neon (не вставляй прямо в репозиторий, только локально / в Vercel):

```dotenv
DATABASE_URL="postgresql://USER:PASS@ep-xxx-yyy.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

## Команды (PowerShell, Windows)

- **Установка зависимостей** (если нужно переустановить):

```powershell
cd pro-trading
npm install
```

- **Генерация Prisma Client**:

```powershell
cd pro-trading
npm run prisma:generate
```

- **Применение миграции (создание таблицы `Note`)**:

```powershell
cd pro-trading
npm run prisma:migrate
```

- **Seed (создание минимальных данных `Note`)**:

```powershell
cd pro-trading
npm run prisma:seed
```

- **Запуск dev-сервера**:

```powershell
cd pro-trading
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
