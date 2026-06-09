# Project Context

_Last updated: 2026-06-09_

## Project

Desktop Pomodoro-таймер. Цель — практика Go.
**Stack:** Go + Wails v2 + React (TypeScript) + antd. Разработка в WSL, сборка и запуск на Windows.

## Current State

- Wails v2.12.0 установлен в WSL (`/home/amironenko/go/bin/wails`)
- Go 1.26.4 установлен в WSL (`/usr/local/go/bin/go`)
- Проект инициализирован: `wails init -n pomodoro -t react-ts`
- Файлы подняты из `pomodoro/pomodoro/` в корень проекта
- `frontend/` — чистый Vite+React+TS шаблон, antd ещё не установлен
- npm-зависимости ещё не установлены (`npm install` не запускался)

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
| История сессий | Backlog |
| Autostart с Windows | Backlog |
| Длительности / цикл 4 pomodoro | Открыто, изучается |

## Architecture Notes

- Публичные методы `App` в `app.go` → автоматически доступны из React
- Wails генерирует TS-биндинги в `frontend/wailsjs/go/` при `wails dev`/`wails build`
- Go → React: `runtime.EventsEmit(ctx, "event-name", data)`
- React → Go: вызов сгенерированных TS-функций
- Хуки жизненного цикла: `OnStartup`, `OnBeforeClose` в `main.go`
- Трей: через `OnBeforeClose` перехватываем закрытие → `runtime.WindowHide`

## Plan Progress

Детальный план: `ai-wiki/plan.md`

- [x] M0 Step 0.1 — Go + Wails CLI установлены
- [x] M0 Step 0.2 — Wails-проект инициализирован
- [ ] M0 Step 0.3 — npm install + antd (следующий шаг)
- [ ] M0 Step 0.4 — wails dev (проверка dev-режима)
- [ ] M1 — Core Timer (Go)
- [ ] M2 — UI (React)
- [ ] M3 — Tray
- [ ] M4 — Notifications
- [ ] M5 — Settings Persistence
- [ ] M6 — Polish & Build

## Next Step

**Step 0.3**: пользователь изучает структуру проекта, задаёт вопросы.
После — `cd frontend && npm install && npm install antd`, затем `wails dev`.
