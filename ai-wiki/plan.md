# Pomodoro App — Plan

_Last updated: 2026-06-09_

## Summary

Desktop Pomodoro-таймер на **Go + Wails + React + antd**.
Разработка в WSL, сборка и запуск на Windows.

- Окно с таймером и кнопками управления
- Скрытие в системный трей (крестик → трей, Quit в меню трея → выход)
- Системные Windows-уведомления по окончании фазы
- Сохранение настроек между запусками (JSON/файл)
- Статичная иконка трея (смена иконки — в планах)

## Decisions Log

| Тема | Решение | Статус |
|---|---|---|
| Длительности таймера | Классика 25/5/15 | Изучается, м.б. кастом |
| Цикл (4 pomodoro → длинный перерыв) | Пока не определено | Открыт |
| Автостарт следующей фазы | Нет, ждём нажатия | Решено |
| Закрытие окна | Крестик → трей | Решено |
| Иконка трея | Статичная сейчас | Смена в планах |
| Звук | Не нужен сейчас | Открыт |
| История сессий | Не нужна сейчас | В планах |
| Autostart при входе в Windows | Не нужен сейчас | В планах |

---

## Milestones

### M0 — Prerequisites & Scaffold
Установка инструментов, инициализация проекта Wails.

### M1 — Core Timer (Go)
Логика таймера на Go: tick, фазы, события.

### M2 — UI (React)
Отображение таймера, кнопки Start/Pause/Reset, смена фаз.

### M3 — Tray
Системный трей: иконка, меню, hide/show окна.

### M4 — Notifications
Windows toast-уведомления при окончании фазы.

### M5 — Settings Persistence
Сохранение/загрузка настроек (длительности, возможно тема).

### M6 — Polish & Build
Иконка приложения, финальный билд `.exe`, тест на Windows.

---

## Steps

### M0 — Prerequisites & Scaffold

- [x] **Step 0.1** — Установить Go и Wails CLI
  - Go ≥ 1.21: https://go.dev/dl/
  - `go install github.com/wailsapp/wails/v2/cmd/wails@latest`
  - Проверить: `wails doctor`
  - > ⚠️ Нужно делать на **Windows** (или в WSL с Go установленным в WSL)
  - > На Windows также нужен gcc: https://www.msys2.org/

- [x] **Step 0.2** — Инициализировать Wails-проект
  ```bash
  wails init -n pomodoro -t react-ts
  ```
  Запускать из директории проекта. Создаст структуру:
  ```
  pomodoro/
  ├── main.go          # точка входа, wails.Run()
  ├── app.go           # App struct, методы для фронта
  ├── wails.json       # конфиг проекта
  ├── frontend/        # React-приложение
  │   ├── src/
  │   ├── package.json
  │   └── vite.config.ts
  └── build/           # ресурсы для билда (иконки, манифест)
  ```

- [ ] **Step 0.3** — Установить зависимости фронта и проверить dev-режим
  ```bash
  cd frontend && npm install
  wails dev   # открывает окно в dev-режиме с hot-reload
  ```

- [ ] **Step 0.4** — Добавить antd
  ```bash
  cd frontend && npm install antd
  ```

---

### M1 — Core Timer (Go)

- [ ] **Step 1.1** — Структура состояния таймера (`app.go`)
  - `TimerState`: фаза (work/short/long), оставшееся время, статус (idle/running/paused)
  - Настройки: длительности фаз

- [ ] **Step 1.2** — Методы таймера, экспортируемые во фронт
  - `Start()`, `Pause()`, `Reset()`, `GetState() TimerState`
  - Внутренний `time.Ticker`, горутина

- [ ] **Step 1.3** — События Go → React
  - `runtime.EventsEmit(ctx, "timer:tick", state)` — каждую секунду
  - `runtime.EventsEmit(ctx, "timer:done", phase)` — по окончании фазы

---

### M2 — UI (React)

- [ ] **Step 2.1** — Компонент таймера
  - Отображение MM:SS
  - Подписка на `timer:tick` через Wails Events API
  - @react-standards

- [ ] **Step 2.2** — Кнопки управления
  - Start / Pause / Reset
  - Вызов Go-методов через Wails bindings
  - Стили через antd Button

- [ ] **Step 2.3** — Индикатор фазы
  - Текущая фаза: Work / Short Break / Long Break
  - antd Tag или Badge

---

### M3 — Tray

- [ ] **Step 3.1** — Интеграция systray-либы
  - Использовать `github.com/getlantern/systray` или встроенный Wails tray API
  - Иконка: embed PNG/ICO

- [ ] **Step 3.2** — Меню трея
  - Show / Hide окно
  - Текущий статус (фаза + время)
  - Quit

- [ ] **Step 3.3** — Поведение окна
  - Крестик → скрыть окно (`runtime.WindowHide`)
  - Wails: перехват `OnBeforeClose`

---

### M4 — Notifications

- [ ] **Step 4.1** — Windows toast-уведомления
  - Использовать `github.com/go-toast/toast` или `beeep`
  - Триггер: событие `timer:done` внутри Go

---

### M5 — Settings Persistence

- [ ] **Step 5.1** — Структура настроек и файл
  - `Settings`: WorkDuration, ShortBreak, LongBreak
  - Сохранение в `%APPDATA%/pomodoro/settings.json`

- [ ] **Step 5.2** — Load/Save методы + UI настроек
  - `GetSettings()`, `SaveSettings(s Settings)` — экспорт во фронт
  - Простая форма в React (antd InputNumber)

---

### M6 — Polish & Build

- [ ] **Step 6.1** — Иконка приложения
  - Заменить дефолтную иконку Wails в `build/`

- [ ] **Step 6.2** — Финальный билд
  ```bash
  wails build -platform windows/amd64
  ```
  Результат: `build/bin/pomodoro.exe`

- [ ] **Step 6.3** — Тест на Windows
  - Запустить `.exe`, проверить трей, уведомления, сохранение настроек

---

## Backlog (не в текущем скоупе)

- [ ] Смена иконки трея по фазе (work/break)
- [ ] Звуковой сигнал при окончании фазы
- [ ] История сессий (статистика за день)
- [ ] Автозапуск с Windows
- [ ] Автоматический цикл (4 pomodoro → длинный перерыв)
- [ ] Кастомные длительности через UI

---

## Risks

1. **WSL → Windows build** — Wails GUI требует сборки с CGO и WebView2 SDK; в чистом WSL без X11/Windows Go может не собраться. Решение: установить Go на Windows и запускать `wails` оттуда.
2. **systray в Wails v2** — встроенный Wails tray API ограничен; возможно, нужна отдельная либа (`getlantern/systray`). Уточним на Step 3.1.
3. **antd + Vite** — tree-shaking работает из коробки, но размер бандла стоит проверить.
