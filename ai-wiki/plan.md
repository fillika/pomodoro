# Pomo App — Plan

_Last updated: 2026-06-09_

## Summary

Desktop Pomodoro-таймер на **Go + Wails v2 + React + antd**.
Разработка в WSL, сборка и запуск на Windows. CI/CD через GitHub Actions.

## Decisions Log

| Тема | Решение |
|---|---|
| Название приложения | Pomo |
| Окно | 500×500, фиксированный размер (Min=Max) |
| Длительности по умолчанию | Основной: 30 мин, короткий перерыв: 5, длинный: 15 |
| Длина цикла | 4 pomodoro → длинный перерыв, счётчик сбрасывается |
| Автостарт следующей фазы | Нет — ждём действия пользователя |
| После окончания фокуса | Кнопки: «Начать перерыв» и «Следующий цикл» |
| Кастомная длительность | One-shot переопределение через правую часть сплит-кнопки |
| Пауза | Заменяет кнопку «Начать», работает в фокусе и перерыве |
| Закрытие окна | Крестик → трей |
| Уведомления | Windows toast по окончании фазы |
| Звук | Не нужен |
| Тема | antd dark algorithm |
| Хранение настроек | SQLite (пока DEFAULT_SETTINGS-константы) |

## State Machine

```
idle → focusing → focus_done → on_break → break_done → focusing...
         ↕ pause/resume            ↕ pause/resume
      paused_focus              paused_break
```

| Состояние | Заголовок | Кнопки |
|---|---|---|
| `idle` | — | [Начать \| 30 мин▾] |
| `focusing` | Работа 2/4 + время | [Пауза] |
| `paused` | Работа 2/4 (пауза) + время | [Продолжить] |
| `focus_done` | Работа завершена | [Начать перерыв] [Следующий цикл] |
| `on_break` | Короткий/Длинный перерыв + время | [Пауза] |
| `break_done` | Перерыв завершён | [Начать \| 30 мин▾] |

---

## Milestones

### ✅ M0 — Prerequisites & Scaffold
- Go 1.23 + Wails v2.12.0 в WSL
- React + TypeScript + antd (dark theme)
- FSD-структура фронта
- `wails dev -browser` и `wails build` работают
- GitHub Actions: сборка Windows + Linux → release `latest`

### ✅ M0.5 — Layout & Settings UI
- Toolbar с навигацией (Главная / Настройки)
- Settings page: поля из DEFAULT_SETTINGS, кнопка-дискета (dirty state)
- `shared/config/settings.ts`: `Settings` тип + `DEFAULT_SETTINGS`
- Scroll в content при переполнении

---

### 🔄 M1 — Frontend Timer UI (моки, без Go)

- [ ] **1.1** — `entities/timer/model/state.ts`
  Тип `TimerState`: `phase`, `status`, `remaining`, `cycleIndex`, `cycleLength`
  Тип `TimerStatus`: `idle | focusing | paused | focus_done | on_break | break_done`
  Тип `TimerPhase`: `focus | short_break | long_break`

- [ ] **1.2** — `entities/timer/model/transitions.ts`
  Чистые функции: `getNextPhase(cycleIndex, cycleLength)`, `getBreakDuration(phase, settings)`, `formatTime(seconds)`

- [ ] **1.3** — `features/timer-controls` — сплит-кнопка
  Левая часть: «Начать» / «Пойти на перерыв» / «Следующий цикл» / «Продолжить»
  Правая часть: длительность с popover для one-shot переопределения

- [ ] **1.4** — `entities/timer/ui/TimerDisplay`
  Заголовок фазы («Работа 2/4», «Короткий перерыв»)
  Время MM:SS на отдельной строке, крупнее

- [ ] **1.5** — `pages/timer` — сборка всего
  Стейт-машина через `useReducer`
  Моковый `useEffect`-тик (каждую секунду --remaining)

---

### M2 — Core Timer (Go)

- [ ] **2.1** — `app.go`: `TimerState` struct, `StartFocus(duration int)`, `Pause()`, `Resume()`, `StartBreak()`, `SkipBreak()`
- [ ] **2.2** — `time.Ticker` в горутине, `runtime.EventsEmit(ctx, "timer:tick", state)`
- [ ] **2.3** — Подключение фронта к Go: заменить мок на Wails bindings + `EventsOn("timer:tick")`

---

### M3 — Tray

- [ ] **3.1** — Иконка трея, меню (Show / Quit)
- [ ] **3.2** — `OnBeforeClose` → `runtime.WindowHide`

---

### M4 — Notifications

- [ ] **4.1** — Windows toast при `timer:done` (go-toast или beeep)

---

### M5 — Settings Persistence

- [ ] **5.1** — SQLite в Go (`%APPDATA%/pomo/pomo.db`)
- [ ] **5.2** — `GetSettings()` / `SaveSettings()` → подключить к Settings page (убрать мок)

---

### M6 — Polish & Build

- [ ] **6.1** — Иконка приложения (заменить дефолтную Wails)
- [ ] **6.2** — Финальный тест `.exe` на Windows

---

## Backlog

- Смена иконки трея по фазе
- История сессий (статистика за день)
- Автозапуск с Windows
