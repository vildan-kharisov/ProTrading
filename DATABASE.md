## Что есть в системе (сущности):

Note - заметки
User — владелец Tradeidea, автор, голосующий
Tradeidea — сам Tradeidea (может быть приватным или публичным)
Tag — метки (многие-ко-многим с Tradeidea)
Vote — голос пользователя за публичный Tradeidea (уникально: один пользователь → один голос на Tradeidea)
(опционально) Collection / Folder — папки/коллекции для организации
(опционально) TradeideaVersion — версии Tradeidea (история изменений)

## Ключевые правила:

- Публичность — это свойство Tradeidea (visibility)
- Голосовать можно только по публичным (проверяется на уровне приложения; можно усилить триггером/констрейнтом позже)
- Голос уникален: (userId, TradeideaId) — уникальный индекс

## Схема базы данных
- Note: id, ownerId -> User, title, createdAt
- User: id (cuid), email unique, name optional, createdAt
- Tradeidea: id, ownerId -> User, title, content, description optional, categoryId -> Category,
  visibility (PRIVATE|PUBLIC, default PRIVATE), createdAt, updatedAt, publishedAt nullable
- Vote: id, userId -> User, TradeideaId -> Tradeidea, value int default 1, createdAt
- Category: id, category
- Ограничение: один пользователь может проголосовать за Tradeidea только один раз:
  UNIQUE(userId, TradeideaId)
- Индексы:
  Tradeidea(ownerId, updatedAt)
  Tradeidea(visibility, createdAt)
  Vote(TradeideaId)
  Vote(userId)
- onDelete: Cascade для связей
