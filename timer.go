package main

import (
	"time"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type TimerStatus string
type TimerPhase string

const (
	StatusIdle      TimerStatus = "idle"
	StatusFocusing  TimerStatus = "focusing"
	StatusPaused    TimerStatus = "paused"
	StatusFocusDone TimerStatus = "focus_done"
	StatusOnBreak   TimerStatus = "on_break"
	StatusBreakDone TimerStatus = "break_done"
)

const (
	PhaseFocus      TimerPhase = "focus"
	PhaseShortBreak TimerPhase = "short_break"
	PhaseLongBreak  TimerPhase = "long_break"
)

const (
	defaultCycleLength        = 4
	defaultFocusDuration      = 30 * 60
	defaultShortBreakDuration = 5 * 60
	defaultLongBreakDuration  = 15 * 60
)

type TimerState struct {
	Status      TimerStatus `json:"status"`
	Phase       TimerPhase  `json:"phase"`
	Remaining   int         `json:"remaining"`
	CycleIndex  int         `json:"cycleIndex"`
	CycleLength int         `json:"cycleLength"`
}

// — exported methods (called from frontend) —

func (a *App) StartFocus(duration int) {
	a.mu.Lock()
	a.state.Status = StatusFocusing
	a.state.Phase = PhaseFocus
	a.state.Remaining = duration
	state := a.state
	a.mu.Unlock()

	a.resetTicker()
	a.startTicker()
	runtime.EventsEmit(a.ctx, "timer:tick", state)
}

func (a *App) Pause() {
	a.mu.Lock()
	if a.state.Status != StatusFocusing && a.state.Status != StatusOnBreak {
		a.mu.Unlock()
		return
	}
	a.state.Status = StatusPaused
	state := a.state
	a.mu.Unlock()

	a.resetTicker()
	runtime.EventsEmit(a.ctx, "timer:tick", state)
}

func (a *App) Resume() {
	a.mu.Lock()
	if a.state.Status != StatusPaused {
		a.mu.Unlock()
		return
	}
	if a.state.Phase == PhaseFocus {
		a.state.Status = StatusFocusing
	} else {
		a.state.Status = StatusOnBreak
	}
	state := a.state
	a.mu.Unlock()

	a.startTicker()
	runtime.EventsEmit(a.ctx, "timer:tick", state)
}

func (a *App) StartBreak(phase string, duration int) {
	a.mu.Lock()
	a.state.Status = StatusOnBreak
	a.state.Phase = TimerPhase(phase)
	a.state.Remaining = duration
	state := a.state
	a.mu.Unlock()

	a.resetTicker()
	a.startTicker()
	runtime.EventsEmit(a.ctx, "timer:tick", state)
}

func (a *App) SkipBreak(duration int) {
	a.mu.Lock()
	cycleIndex := a.state.CycleIndex
	if cycleIndex%a.state.CycleLength == 0 {
		cycleIndex = 0
	}
	a.state.Status = StatusFocusing
	a.state.Phase = PhaseFocus
	a.state.Remaining = duration
	a.state.CycleIndex = cycleIndex
	state := a.state
	a.mu.Unlock()

	a.resetTicker()
	a.startTicker()
	runtime.EventsEmit(a.ctx, "timer:tick", state)
}

func (a *App) Complete() {
	a.mu.Lock()
	if a.state.Phase == PhaseFocus {
		a.state.Status = StatusFocusDone
		a.state.Remaining = 0
		a.state.CycleIndex++
	} else {
		a.state.Status = StatusBreakDone
		a.state.Remaining = 0
		if a.state.Phase == PhaseLongBreak {
			a.state.CycleIndex = 0
		}
	}
	state := a.state
	a.mu.Unlock()

	a.resetTicker()
	runtime.EventsEmit(a.ctx, "timer:tick", state)
}

func (a *App) GetState() TimerState {
	a.mu.Lock()
	defer a.mu.Unlock()
	return a.state
}

// — internal ticker —

func (a *App) startTicker() {
	stopCh := make(chan struct{})
	a.mu.Lock()
	a.stopCh = stopCh
	a.mu.Unlock()

	go func() {
		ticker := time.NewTicker(time.Second)
		defer ticker.Stop()
		for {
			select {
			case <-ticker.C:
				a.tick()
			case <-stopCh:
				return
			}
		}
	}()
}

func (a *App) resetTicker() {
	a.mu.Lock()
	ch := a.stopCh
	a.stopCh = nil
	a.mu.Unlock()

	if ch != nil {
		close(ch)
	}
}

func (a *App) tick() {
	a.mu.Lock()

	if a.state.Remaining > 1 {
		a.state.Remaining--
		state := a.state
		a.mu.Unlock()
		runtime.EventsEmit(a.ctx, "timer:tick", state)
		return
	}

	// phase complete
	a.state.Remaining = 0
	var done bool
	if a.state.Status == StatusFocusing {
		a.state.Status = StatusFocusDone
		a.state.CycleIndex++
		done = true
	} else if a.state.Status == StatusOnBreak {
		a.state.Status = StatusBreakDone
		if a.state.Phase == PhaseLongBreak {
			a.state.CycleIndex = 0
		}
		done = true
	}
	phase := a.state.Phase
	state := a.state
	a.mu.Unlock()

	if done {
		a.resetTicker()
		go a.sendNotification(phase)
		runtime.EventsEmit(a.ctx, "timer:done", phase)
	}
	runtime.EventsEmit(a.ctx, "timer:tick", state)
}
