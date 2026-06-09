# Log

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
