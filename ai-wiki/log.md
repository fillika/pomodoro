# Log

---

## 2026-06-09 — Session 4: Go Timer + Frontend Connect (M2 complete)

- `timer.go`: TimerStatus/Phase/State типы, горутина time.Ticker, sync.Mutex, tick()
- Go-методы: StartFocus, Pause, Resume, StartBreak, SkipBreak, Complete, GetState
- События: `timer:tick` (каждую секунду + при переходах), `timer:done` (для M4)
- `app.go` обновлён: поля mu/state/stopCh, NewApp инициализирует стейт (idle, 30 мин)
- `main.go`: `DisableResize: true` (правильное поле в v2.12, убирает кнопку разворачивания)
- Фронт подключён: `useState` + `EventsOn('timer:tick')` + `GetState()` при монте
- `shared/api/timer.ts` обновлён — реэкспорт Go-биндингов
- Редьюсер (`pages/timer/model/reducer.ts`) удалён, Go — источник истины
- Хранение настроек: решено использовать JSON в `%APPDATA%\Pomo\` (установленное приложение)
- Планируется инсталлятор (NSIS/WiX) как эксперимент

---

## 2026-06-09 — Session 3: Frontend Timer UI (M1 complete)

- Toolbar: styled-components (`styled.ts`), компактный header 36px, antd dark theme включён через ConfigProvider
- Prettier установлен, `make format` добавлен в Makefile
- GitHub Actions: `.github/workflows/release.yml` — push to main → build win/linux → release `latest`
- `shared/config/settings.ts`: `Settings` тип + `DEFAULT_SETTINGS` (фокус 30 мин)
- Settings page: форма с полями, кнопка-дискета (dirty state), antd InputNumber
- `entities/timer/model/types.ts`: новые типы `TimerStatus`, `TimerPhase`, `TimerState` с `cycleIndex`
- `entities/timer/model/transitions.ts`: `getBreakPhase`, `getBreakDuration`, `getInitialState`, `formatTime`, `getPhaseLabel`
- `features/timer-controls`: `TimerControls` + `SplitButton` (one-shot duration override через popover)
- `entities/timer/ui/TimerDisplay`: фиксированная высота 88px, фаза + время MM:SS
- `pages/timer/model/reducer.ts`: `timerReducer` с actions START/PAUSE/RESUME/TICK/COMPLETE/START_BREAK/SKIP_BREAK
- `pages/timer/index.tsx`: `useReducer` + `useEffect` мок-тик, полная стейт-машина
- Баг исправлен: SKIP_BREAK сбрасывает cycleIndex при достижении границы длинного перерыва
- Терминология: "Работа" → "Фокус", "Следующий цикл" → "Фокус", "Начать перерыв" → "Перерыв"

---

## 2026-06-09 — Session 2: Scaffold & Dev Setup

- FSD-структура фронтенда создана: app, pages, features, entities, shared
- Алиасы `@/` и `@wailsjs` настроены в vite.config.ts + tsconfig.json
- `app.go`: добавлены `StartTimer()` и `PauseTimer()` (заглушки)
- `shared/api/timer.ts`: обёртки над Wails-биндингами
- `features/timer-controls`: кнопки Start/Pause с antd, подключены к TimerPage
- Dev-окружение WSL: установлены gcc, pkg-config, libwebkit2gtk-4.1-dev, wslu
- `wails dev -browser -tags webkit2_41` работает, браузер открывается автоматически
- `wails build -platform windows/amd64` работает, .exe запускается на Windows
- Подтверждено: кнопки в браузере вызывают Go-методы (fmt.Println в терминале)
- M0 полностью завершён

---

## 2026-06-09 — Session 1: Init

- Собраны требования: Pomodoro-таймер, окно + трей, уведомления, сохранение настроек
- Создан `ai-wiki/plan.md` с разбивкой на M0–M6 + backlog
- Go 1.26.4 установлен в WSL, Wails v2.12.0 установлен
- `wails init -n pomodoro -t react-ts` выполнен, файлы подняты в корень
- Пользователь знакомится со структурой проекта
- Следующий шаг: `npm install` + `antd`, затем `wails dev`
