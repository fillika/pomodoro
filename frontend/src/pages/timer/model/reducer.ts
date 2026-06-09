import type { TimerPhase, TimerState } from '@/entities/timer'

export type TimerAction =
  | { type: 'START'; duration: number }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'START_BREAK'; phase: TimerPhase; duration: number }
  | { type: 'SKIP_BREAK'; duration: number }
  | { type: 'TICK' }
  | { type: 'COMPLETE' }

export const timerReducer = (state: TimerState, action: TimerAction): TimerState => {
  switch (action.type) {
    case 'START':
      return { ...state, status: 'focusing', phase: 'focus', remaining: action.duration }

    case 'PAUSE':
      return { ...state, status: 'paused' }

    case 'RESUME':
      return { ...state, status: state.phase === 'focus' ? 'focusing' : 'on_break' }

    case 'START_BREAK':
      return { ...state, status: 'on_break', phase: action.phase, remaining: action.duration }

    case 'SKIP_BREAK':
      return {
        ...state,
        status: 'focusing',
        phase: 'focus',
        remaining: action.duration,
        cycleIndex: state.cycleIndex % state.cycleLength === 0 ? 0 : state.cycleIndex,
      }

    case 'TICK': {
      if (state.remaining > 1) return { ...state, remaining: state.remaining - 1 }
      if (state.status === 'focusing') {
        return { ...state, status: 'focus_done', remaining: 0, cycleIndex: state.cycleIndex + 1 }
      }
      if (state.status === 'on_break') {
        return {
          ...state,
          status: 'break_done',
          remaining: 0,
          cycleIndex: state.phase === 'long_break' ? 0 : state.cycleIndex,
        }
      }
      return state
    }

    case 'COMPLETE': {
      const isFocus = state.phase === 'focus'
      if (isFocus) {
        return { ...state, status: 'focus_done', remaining: 0, cycleIndex: state.cycleIndex + 1 }
      }
      return {
        ...state,
        status: 'break_done',
        remaining: 0,
        cycleIndex: state.phase === 'long_break' ? 0 : state.cycleIndex,
      }
    }

    default:
      return state
  }
}
