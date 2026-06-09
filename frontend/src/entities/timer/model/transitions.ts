import type { Settings } from '@/shared/config'
import type { TimerPhase, TimerState } from './types'

export const getBreakPhase = (cycleIndex: number, cycleLength: number): TimerPhase =>
  cycleIndex % cycleLength === 0 ? 'long_break' : 'short_break'

export const getBreakDuration = (phase: TimerPhase, settings: Settings): number => {
  if (phase === 'long_break') return settings.longBreakDuration * 60
  if (phase === 'short_break') return settings.shortBreakDuration * 60
  return 0
}

export const getInitialState = (settings: Settings): TimerState => ({
  status: 'idle',
  phase: 'focus',
  remaining: settings.pomodoroDuration * 60,
  cycleIndex: 0,
  cycleLength: settings.cycleLength,
})

export const getPhaseLabel = (state: TimerState): string => {
  const { status, phase, cycleIndex, cycleLength } = state
  switch (status) {
    case 'focusing':
      return `Фокус ${cycleIndex + 1}/${cycleLength}`
    case 'paused':
      return `Фокус ${cycleIndex + 1}/${cycleLength} (пауза)`
    case 'focus_done':
      return 'Фокус завершён'
    case 'on_break':
      return phase === 'long_break' ? 'Длинный перерыв' : 'Короткий перерыв'
    case 'break_done':
      return 'Перерыв завершён'
    default:
      return ''
  }
}

export const formatTime = (seconds: number): string => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
