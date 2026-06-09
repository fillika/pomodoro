# Project Context

_Last updated: 2026-06-09_

## Project

Desktop Pomodoro-таймер. Цель — практика Go.
**Stack:** Go + Wails v2 + React (TypeScript) + antd (dark theme) + styled-components. Разработка в WSL, сборка и запуск на Windows.

## Environment

- Go 1.23 (go.mod), Wails v2.12.0 — в WSL
- Dev-режим: `wails dev -browser -tags webkit2_41` (make dev)
- Windows-сборка: `wails build -platform windows/amd64` (make build-windows)
- GitHub Actions: push to main → сборка win/linux → release `latest`
- Зависимости WSL: gcc, pkg-config, libwebkit2gtk-4.1-dev, mingw-w64, wslu

## Current State

- M0 + M0.5 полностью завершены
- M1 (Frontend) завершён: стейт-машина, таймер, кнопки — всё работает на моках
- Следующий шаг: M2 — Go-таймер (time.Ticker, EventsEmit, замена мок-тика)

## Frontend Structure (FSD)

```
src/
├── app/          # App.tsx, providers (antd dark), layout (Header+Content), types
├── pages/
│   ├── timer/    # TimerPage + useReducer + мок-тик
│   │   └── model/reducer.ts  # timerReducer, TimerAction
│   └── settings/ # SettingsPage (форма + кнопка-дискета)
├── features/
│   └── timer-controls/  # TimerControls, SplitButton (styled.ts)
├── entities/
│   └── timer/    # TimerDisplay, types, transitions
└── shared/
    ├── api/timer.ts
    └── config/settings.ts  # Settings, DEFAULT_SETTINGS
```

## State Machine (Frontend)

```
idle → focusing → focus_done → on_break → break_done → focusing...
         ↕ pause/resume            ↕ pause/resume
```

| Состояние   | Кнопки                              |
|-------------|-------------------------------------|
| idle        | [Начать \| 30 мин▾]                 |
| focusing    | [Пауза] [Завершить]                 |
| paused      | [Продолжить] [Завершить]            |
| focus_done  | [Перерыв] [Фокус]                   |
| on_break    | [Пауза] [Завершить]                 |
| break_done  | [Начать \| 30 мин▾]                 |

## Actions (reducer)

`START(duration)`, `PAUSE`, `RESUME`, `TICK`, `COMPLETE`, `START_BREAK(phase, duration)`, `SKIP_BREAK(duration)`

## Decisions

| Тема | Решение |
|---|---|
| Название | Pomo (окно), "Фокус" (UI) |
| Окно | 500×500, Resizable: false (в go.mod уже есть, в v2.12 не работает — Min=Max вместо) |
| Длительности | Фокус: 30 мин, короткий: 5, длинный: 15 |
| Цикл | 4 сессии → длинный перерыв, счётчик сбрасывается |
| Автостарт | Нет — ждём пользователя |
| Кастом длительность | One-shot (правая часть сплит-кнопки) |
| Пауза | Вместо "Начать", работает в фокусе и перерыве |
| Хранение настроек | SQLite (пока DEFAULT_SETTINGS) |
| Уведомления | Windows toast по окончании фазы |
| Звук | Не нужен |
| Тема | antd dark algorithm |
| prettier | Установлен, `make format` |

## Go Structure

- `app.go`: `StartTimer()` и `PauseTimer()` — заглушки
- `main.go`: Wails run, 500×500, `Resizable: false` (поле есть в go файле, но игнорируется v2.12)

## Plan Progress

- [x] M0 — Prerequisites & Scaffold
- [x] M0.5 — Layout, toolbar, settings UI, DEFAULT_SETTINGS
- [x] M1 — Frontend Timer UI (моки)
- [ ] M2 — Core Timer (Go): TimerState, Ticker, EventsEmit
- [ ] M3 — Tray
- [ ] M4 — Notifications
- [ ] M5 — Settings Persistence (SQLite)
- [ ] M6 — Polish & Build

## Next Step

**M2**: реализация Go-таймера — `TimerState` struct, `time.Ticker` в горутине, `runtime.EventsEmit`, методы `StartFocus(duration)`, `Pause()`, `Resume()`, `StartBreak()`, `SkipBreak()`, `Complete()`. Затем подключить фронт (заменить мок-тик на `EventsOn("timer:tick")`).
