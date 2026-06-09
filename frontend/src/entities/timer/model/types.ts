export type TimerPhase = 'work' | 'short-break' | 'long-break'

export type TimerStatus = 'idle' | 'running' | 'paused'

export interface TimerState {
  phase: TimerPhase
  status: TimerStatus
  remaining: number
}
