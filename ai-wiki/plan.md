# Pomo App — Plan

_Last updated: 2026-06-09 (Session 5)_

## Summary

Desktop Pomodoro-таймер на **Go + Wails v2 + React + antd**.
Разработка в WSL, сборка и запуск на Windows. CI/CD через GitHub Actions.

## Decisions Log

| Тема | Решение |
|---|---|
| Название | Pomo (окно), "Фокус" (UI) |
| Окно | 500×500, `DisableResize: true` |
| Длительности | Фокус: 30 мин, короткий: 5, длинный: 15 |
| Цикл | 4 сессии → длинный перерыв, счётчик сбрасывается |
| Автостарт | Нет |
| Кастом длительность | One-shot через правую часть сплит-кнопки |
| Закрытие окна | Крестик → трей |
| Уведомления | Windows toast при `timer:done` |
| Звук | Не нужен |
| Хранение настроек | JSON в `%APPDATA%\Pomo\settings.json` |
| Установка | Цель — установленное приложение (не portable) |

## State Machine

| Состояние  | Заголовок              | Кнопки                       |
|------------|------------------------|------------------------------|
| idle       | —                      | [Начать \| 30 мин▾]          |
| focusing   | Фокус 2/4 + время      | [Пауза] [Завершить]          |
| paused     | Фокус 2/4 (пауза)      | [Продолжить] [Завершить]     |
| focus_done | Фокус завершён         | [Перерыв] [Фокус]            |
| on_break   | Короткий/Длинный + время | [Пауза] [Завершить]        |
| break_done | Перерыв завершён       | [Начать \| 30 мин▾]          |

---

## Milestones

### ✅ M0 — Prerequisites & Scaffold
- Go 1.23 + Wails v2.12.0, FSD-структура, antd dark theme
- `wails dev -browser` и `wails build` работают
- GitHub Actions: push to main → build win/linux → release `latest`

### ✅ M0.5 — Layout & Settings UI
- Toolbar (styled-components), навигация Главная/Настройки
- Settings page: форма + кнопка-дискета, `DEFAULT_SETTINGS`
- Scroll, фиксированное окно 500×500

### ✅ M1 — Frontend Timer UI
- Типы: `TimerStatus`, `TimerPhase`, `TimerState`
- Transitions: `getBreakPhase`, `getBreakDuration`, `getInitialState`, `formatTime`, `getPhaseLabel`
- `TimerDisplay` (88px fixed height), `TimerControls`, `SplitButton`
- Полная стейт-машина через `useReducer` + мок-тик

### ✅ M2 — Core Timer (Go) + подключение фронта
- `timer.go`: типы, горутина `time.Ticker`, mutex, `tick()`
- Методы: `StartFocus`, `Pause`, `Resume`, `StartBreak`, `SkipBreak`, `Complete`, `GetState`
- События: `timer:tick` (каждую секунду), `timer:done` (естественное завершение)
- Фронт: `useState` + `EventsOn('timer:tick')` + `GetState()` при монте
- Редьюсер удалён, Go — источник истины

---

### ✅ M3 — Tray

- `energye/systray v1.0.1` — форк для webview, message loop в отдельной горутине
- Иконка: `build/windows/icon.ico` (embed), меню: Открыть / Выход
- Двойной клик по иконке → `WindowShow`
- `forceQuit bool` в App: крестик → WindowHide, Выход → реальный quit
- `tray_linux.go` — пустая заглушка; `libayatana-appindicator3-dev` убрана из CI

---

### M4 — Notifications

- [ ] **4.1** — Windows toast при `timer:done`
  - `git.sr.ht/~jackmordaunt/go-toast/v2` уже в go.mod как indirect dep Wails — можно использовать без новой зависимости
  - Подписка на `timer:done` внутри Go (`app.go` или отдельный `notify_windows.go`)

---

### M5 — Settings Persistence

- [ ] **5.1** — `settings.go`: чтение/запись `%APPDATA%\Pomo\settings.json`
  - `os.UserConfigDir()` для пути
  - `GetSettings() Settings`, `SaveSettings(s Settings)`
- [ ] **5.2** — Подключить к фронту: Settings page вызывает `GetSettings`/`SaveSettings`
- [ ] **5.3** — При старте Go загружает настройки и инициализирует таймер с ними

---

### M6 — Polish & Build

- [ ] **6.1** — Иконка приложения (заменить дефолтную Wails в `build/`)
- [ ] **6.2** — Инсталлятор (NSIS или WiX) — эксперимент
- [ ] **6.3** — Финальный тест `.exe` на Windows

---

## Backlog

- Смена иконки трея по фазе
- История сессий (`%APPDATA%\Pomo\history.db`)
- Автозапуск с Windows
