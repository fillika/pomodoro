package main

import (
	_ "embed"

	"github.com/energye/systray"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

//go:embed build/windows/icon.ico
var trayIcon []byte

func (a *App) startTray() {
	systray.SetOnDClick(func(_ systray.IMenu) {
		runtime.WindowShow(a.ctx)
	})
	start, _ := systray.RunWithExternalLoop(a.onTrayReady, nil)
	start()
}

func (a *App) onTrayReady() {
	systray.SetIcon(trayIcon)
	systray.SetTooltip("Pomo")

	show := systray.AddMenuItem("Открыть", "")
	show.Click(func() { runtime.WindowShow(a.ctx) })
	systray.AddSeparator()
	quit := systray.AddMenuItem("Выход", "")
	quit.Click(func() {
		a.forceQuit = true
		runtime.Quit(a.ctx)
	})
}
