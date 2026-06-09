export type TimerPhase = 'focus' | 'short_break' | 'long_break'

export type TimerStatus = 'idle' | 'focusing' | 'paused' | 'focus_done' | 'on_break' | 'break_done'

export interface TimerState {
  status: TimerStatus
  phase: TimerPhase
  remaining: number
  cycleIndex: number
  cycleLength: number
}
