package main

import (
	"context"
	"sync"
)

type App struct {
	ctx        context.Context
	mu         sync.Mutex
	state      TimerState
	stopCh     chan struct{}
	forceQuit  bool
}

func NewApp() *App {
	return &App{
		state: TimerState{
			Status:      StatusIdle,
			Phase:       PhaseFocus,
			Remaining:   defaultFocusDuration,
			CycleIndex:  0,
			CycleLength: defaultCycleLength,
		},
	}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	a.initNotifications()
	a.startTray()
}
