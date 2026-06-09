# Project Context

_Last updated: 2026-06-09_

## Project

Desktop Pomodoro-таймер. Цель — практика Go.
**Stack:** Go + Wails v2 + React (TypeScript) + antd (dark theme) + styled-components. Разработка в WSL, сборка и запуск на Windows.

## Environment

- Go 1.23 (go.mod), Wails v2.12.0 — в WSL
- Dev-режим: `make dev` → `wails dev -browser -tags webkit2_41`
- Windows-сборка: `GOPATH=$HOME/go PATH=$PATH:/usr/local/go/bin make build-windows`
- GitHub Actions: push to main → сборка win/linux → release `latest`
- Go binary: `/usr/local/go/bin/go`, Wails: `~/go/bin/wails`
- Ветки: `develop` — рабочая, `main` — через MR

## Current State

- M0–M4 завершены
- Toast-уведомления работают: при `timer:done` показывается уведомление с кнопкой
- Следующий шаг: M5 — Settings Persistence (JSON в `%APPDATA%\Pomo\settings.json`)

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
app.go             — App struct (ctx, mu, state, stopCh, forceQuit), NewApp, startup
timer.go           — TimerStatus/Phase/State типы, все методы, горутина, константы длительностей
main.go            — wails.Run, 500×500, DisableResize: true, OnBeforeClose (hide/quit)
tray_windows.go    — energye/systray: иконка .ico, меню, двойной клик
tray_linux.go      — заглушка (пустой startTray)
notify_windows.go  — toast-уведомления: initNotifications, sendNotification
notify_linux.go    — заглушки (initNotifications, sendNotification)
```

**Константы длительностей (timer.go):**
`defaultFocusDuration=1800`, `defaultShortBreakDuration=300`, `defaultLongBreakDuration=900`, `defaultCycleLength=4`

**Методы (экспортированы в Wails):**
`StartFocus(duration int)`, `Pause()`, `Resume()`, `StartBreak(phase, duration)`, `SkipBreak(duration)`, `Complete()`, `GetState()`

**События:** `timer:tick` (каждую секунду + при переходах), `timer:done` (естественное завершение фазы)

## Notifications Implementation

- Библиотека: `git.sr.ht/~jackmordaunt/go-toast/v2 v2.0.3` (direct dep в go.mod)
- `initNotifications()` в `startup()`: `SetAppData("Pomo")` + `SetActivationCallback`
- `sendNotification(phase)` вызывается из `tick()` через `go a.sendNotification(phase)` при завершении фазы
- Callback args: `"start_break"` → `StartBreak` (гвард на `StatusFocusDone`), `"start_focus"` → `StartFocus` (гвард на `StatusBreakDone`), остальное → `WindowShow`
- `ActivationArguments: "open"` — клик по телу открывает окно; крестик callback не вызывает

## Tray Implementation

- Библиотека: `github.com/energye/systray v1.0.1` (форк для webview-фреймворков)
- `forceQuit bool` в App — крестик → WindowHide, Выход из меню → реальный quit

## Decisions

| Тема | Решение |
|---|---|
| Название | Pomo (окно), "Фокус" (UI) |
| Окно | 500×500, `DisableResize: true` |
| Длительности | Фокус: 30 мин, короткий: 5, длинный: 15 |
| Цикл | 4 сессии → длинный перерыв, счётчик сбрасывается |
| Уведомления | 1 кнопка в toast; клик на тело → окно; крестик → ничего |
| Звук | Не нужен (toast.Silent) |
| Хранение настроек | JSON в `%APPDATA%\Pomo\settings.json` |

## Plan Progress

- [x] M0 — Scaffold
- [x] M0.5 — Layout, toolbar, settings UI
- [x] M1 — Frontend Timer UI
- [x] M2 — Go Timer
- [x] M3 — Tray
- [x] M4 — Notifications (toast при timer:done)
- [ ] M5 — Settings Persistence (JSON в %APPDATA%)
- [ ] M6 — Polish & Build
