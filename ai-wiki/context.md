# Project Context

_Last updated: 2026-06-09_

## Project

Desktop Pomodoro-таймер. Цель — практика Go.
**Stack:** Go + Wails v2 + React (TypeScript) + antd. Разработка в WSL, сборка и запуск на Windows.

## Environment

- Go 1.26.4, Wails v2.12.0 — в WSL
- Dev-режим: `wails dev -browser -tags webkit2_41` (открывает Windows-браузер через wslu)
- Windows-сборка: `wails build -platform windows/amd64` (mingw-w64 установлен)
- Зависимости WSL: `gcc`, `pkg-config`, `libwebkit2gtk-4.1-dev`, `mingw-w64`, `wslu`

## Current State

- Проект полностью инициализирован и работает
- FSD-структура фронтенда создана
- `wails dev -browser` проверен: кнопки Start/Pause вызывают Go-методы
- `wails build` проверен: `.exe` собирается и запускается на Windows
- antd установлен, алиасы `@/` и `@wailsjs` настроены в vite + tsconfig

## Frontend Structure (FSD)

```
src/
├── app/          # App.tsx (state-based навигация), providers, types, styles
├── pages/        # timer/, settings/ (заглушка)
├── features/     # timer-controls/ (Start/Pause кнопки)
├── entities/     # timer/ (TimerState типы, TimerDisplay заглушка)
└── shared/       # api/timer.ts (обёртки над Wails-биндингами)
```

- Навигация: `useState<Page>` в `App.tsx` (без роутера)
- Биндинги: `@wailsjs/go/main/App` → `StartTimer()`, `PauseTimer()`

## Go Structure

- `app.go`: `StartTimer()` и `PauseTimer()` — заглушки с `fmt.Println`
- `main.go`: стандартный Wails `wails.Run()`, размер окна 1024×768

## Decisions

| Тема | Решение |
|---|---|
| Закрытие окна | Крестик → трей; Quit в меню трея → выход |
| Автостарт следующей фазы | Нет, ждём нажатия пользователя |
| Уведомления | Windows toast-уведомления по окончании фазы |
| Звук | Не нужен |
| Настройки | Сохранять между запусками (JSON) |
| UI-библиотека | antd |
| Иконка трея | Статичная (смена по фазе — backlog) |
| Длительности / цикл 4 pomodoro | Открыто, изучается |

## Plan Progress

- [x] M0 — Prerequisites & Scaffold (полностью готов)
- [ ] M1 — Core Timer (Go): логика таймера, ticker, события
- [ ] M2 — UI (React): отображение таймера, кнопки
- [ ] M3 — Tray
- [ ] M4 — Notifications
- [ ] M5 — Settings Persistence
- [ ] M6 — Polish & Build

## Next Step

**M1**: реализация логики таймера в Go — `TimerState`, `time.Ticker`, `EventsEmit`.
