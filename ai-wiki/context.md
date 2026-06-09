# Project Context

_Last updated: 2026-06-09_

## Project

Desktop Pomodoro-таймер. Цель — практика Go.
**Stack:** Go + Wails v2 + React (TypeScript) + antd (dark theme) + styled-components. Разработка в WSL, сборка и запуск на Windows.

## Environment

- Go 1.23 (go.mod), Wails v2.12.0 — в WSL
- Dev-режим: `make dev` → `wails dev -browser -tags webkit2_41`
- Windows-сборка: `make build-windows`
- GitHub Actions: push to main → сборка win/linux → release `latest`
- Go binary: `/usr/local/go/bin/go`, Wails: `~/go/bin/wails`

## Current State

- M0, M0.5, M1, M2 завершены
- Фронт подключён к Go: `EventsOn('timer:tick')`, `GetState()`, все Go-методы
- Следующий шаг: M3 — системный трей

## Frontend Structure (FSD)

```
src/
├── app/          # App.tsx, providers (antd dark), layout, types
├── pages/
│   ├── timer/    # TimerPage — useState + EventsOn + Go-методы
│   └── settings/ # SettingsPage (форма + кнопка-дискета, пока DEFAULT_SETTINGS)
├── features/
│   └── timer-controls/  # TimerControls, SplitButton (styled.ts)
├── entities/
│   └── timer/    # TimerDisplay (88px fixed), types, transitions
└── shared/
    ├── api/timer.ts      # реэкспорт Go-биндингов
    └── config/settings.ts
```

## State Machine

```
idle → focusing → focus_done → on_break → break_done → focusing...
         ↕ pause/resume            ↕ pause/resume
```

| Состояние  | Кнопки                       |
|------------|------------------------------|
| idle       | [Начать \| 30 мин▾]          |
| focusing   | [Пауза] [Завершить]          |
| paused     | [Продолжить] [Завершить]     |
| focus_done | [Перерыв] [Фокус]            |
| on_break   | [Пауза] [Завершить]          |
| break_done | [Начать \| 30 мин▾]          |

## Go Structure

```
app.go     — App struct (ctx, mu, state, stopCh), NewApp, startup
timer.go   — TimerStatus/Phase/State типы, все методы, горутина
main.go    — wails.Run, 500×500, DisableResize: true
```

**Методы (экспортированы в Wails):**
`StartFocus(duration int)`, `Pause()`, `Resume()`, `StartBreak(phase, duration)`, `SkipBreak(duration)`, `Complete()`, `GetState()`

**События:** `timer:tick` (каждую секунду + при переходах), `timer:done` (естественное завершение фазы, для M4)

## Decisions

| Тема | Решение |
|---|---|
| Название | Pomo (окно), "Фокус" (UI) |
| Окно | 500×500, `DisableResize: true` (убирает кнопку разворачивания) |
| Длительности | Фокус: 30 мин, короткий: 5, длинный: 15 |
| Цикл | 4 сессии → длинный перерыв, счётчик сбрасывается |
| Автостарт | Нет |
| Кастом длительность | One-shot через правую часть сплит-кнопки |
| Хранение настроек | JSON в `%APPDATA%\Pomo\settings.json` (portable отклонён — цель установка) |
| Уведомления | Windows toast при `timer:done` |
| Звук | Не нужен |

## Plan Progress

- [x] M0 — Scaffold
- [x] M0.5 — Layout, toolbar, settings UI
- [x] M1 — Frontend Timer UI
- [x] M2 — Go Timer (timer.go, горутина, EventsEmit, подключение фронта)
- [ ] M3 — Tray (крестик → трей, Quit)
- [ ] M4 — Notifications (toast при timer:done)
- [ ] M5 — Settings Persistence (JSON в %APPDATA%)
- [ ] M6 — Polish & Build

## Next Step

**M3**: системный трей — иконка, меню (Show/Quit), `OnBeforeClose` → `WindowHide`.
