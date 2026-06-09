package main

import (
	toast "git.sr.ht/~jackmordaunt/go-toast/v2"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) initNotifications() {
	_ = toast.SetAppData(toast.AppData{AppID: "Pomo"})
	toast.SetActivationCallback(func(args string, _ []toast.UserData) {
		switch args {
		case "start_break":
			a.mu.Lock()
			if a.state.Status != StatusFocusDone {
				a.mu.Unlock()
				return
			}
			idx := a.state.CycleIndex
			length := a.state.CycleLength
			a.mu.Unlock()
			phase := PhaseShortBreak
			dur := defaultShortBreakDuration
			if idx%length == 0 {
				phase = PhaseLongBreak
				dur = defaultLongBreakDuration
			}
			a.StartBreak(string(phase), dur)
		case "start_focus":
			a.mu.Lock()
			if a.state.Status != StatusBreakDone {
				a.mu.Unlock()
				return
			}
			a.mu.Unlock()
			a.StartFocus(defaultFocusDuration)
		default:
			runtime.WindowShow(a.ctx)
		}
	})
}

func (a *App) sendNotification(phase TimerPhase) {
	n := toast.Notification{
		AppID:               "Pomo",
		Audio:               toast.Silent,
		ActivationArguments: "open",
	}
	switch phase {
	case PhaseFocus:
		n.Title = "Фокус завершён"
		n.Actions = []toast.Action{
			{Type: toast.Foreground, Content: "Начать перерыв", Arguments: "start_break"},
		}
	default:
		n.Title = "Перерыв завершён"
		n.Actions = []toast.Action{
			{Type: toast.Foreground, Content: "Начать фокус", Arguments: "start_focus"},
		}
	}
	_ = n.Push()
}
