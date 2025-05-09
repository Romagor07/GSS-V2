# 📡 GSS Discord Bot

Дискорд-бот для отображения статуса GMod серверов и SCP сервера в текстовых и голосовых каналах.

## 🗂 Структура проекта

```
GSS/
├── index.js              # Основной скрипт бота
├── config.json           # Конфигурация Discord и GMod серверов
├── channels.json         # ID каналов и сообщений
├── scp.js                # Заглушка SCP-сервера
├── package.json          # Зависимости npm
```

## 🚀 Установка и запуск

### 1. 📦 Установите Node.js

Убедитесь, что установлен [Node.js](https://nodejs.org/) версии 16 или выше:

```bash
node -v
npm -v
```

### 2. 📁 Клонируйте или разархивируйте проект

```bash
git clone https://github.com/yourusername/GSS.git
cd GSS
```

_ИЛИ_ просто разархивируйте `GSS_final.zip` в папку проекта.

### 3. 🔧 Установите зависимости

```bash
npm install
```

### 4. ⚙️ Настройте конфигурацию

#### 🔑 `config.json`

```json
{
  "token": "ВАШ_DISCORD_BOT_TOKEN",
  "guildId": "ID_ВАШЕГО_DISCORD_СЕРВЕРА",
  "servers": [
    {
      "name": "DarkRP #1",
      "ip": "127.0.0.1",
      "port": 27015,
      "connect": "127.0.0.1:27015"
    },
    {
      "name": "DarkRP #2",
      "ip": "127.0.0.1",
      "port": 27016,
      "connect": "127.0.0.1:27016"
    },
    {
      "name": "DarkRP #3",
      "ip": "127.0.0.1",
      "port": 27017,
      "connect": "127.0.0.1:27017"
    }
  ]
}
```

#### 📡 `channels.json`

```json
{
  "channel1": "ID_ГОЛОСОВОГО_КАНАЛА_1",
  "channel2": "ID_ГОЛОСОВОГО_КАНАЛА_2",
  "channel3": "ID_ГОЛОСОВОГО_КАНАЛА_SCP",
  "channel4": "ID_ТЕКСТОВОГО_КАНАЛА_ДЛЯ_ВСТАВОК",
  "messageIds": [null, null, null]
}
```

> Первые три — это голосовые каналы, названия которых будут обновляться.  
> Четвёртый — текстовый канал, куда бот отправит embed-сообщения со статусом серверов.

### 5. 🧪 Запуск бота

```bash
npm start
```

## 🔄 Как это работает

- Бот подключается к Discord и серверу Garry's Mod (через [Gamedig](https://github.com/sonicsnes/node-gamedig)).
- Каждые 30 секунд бот обновляет:
  - Названия голосовых каналов: онлайн, количество игроков.
  - Embed-сообщения в текстовом канале.
- Также обновляется статус SCP-сервера через `scp.js`.

## 📷 Пример embed-сообщения

![пример embed-сообщения](https://i.imgur.com/GQZVoTO.png)

## 📜 Лицензия

MIT © [romagor07](https://github.com/Romagor07)
