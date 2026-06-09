import { useReducer, useState, useEffect } from 'react'
import { TimerDisplay, getBreakPhase, getBreakDuration, getInitialState } from '@/entities/timer'
import { TimerControls } from '@/features/timer-controls'
import { DEFAULT_SETTINGS } from '@/shared/config'
import { timerReducer } from './model/reducer'
import { PageRoot } from './styled'

export const TimerPage = () => {
  const settings = DEFAULT_SETTINGS
  const [state, dispatch] = useReducer(timerReducer, getInitialState(settings))
  const [customDuration, setCustomDuration] = useState<number | null>(null)

  useEffect(() => {
    if (state.status !== 'focusing' && state.status !== 'on_break') return
    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(id)
  }, [state.status])

  const displayDuration = customDuration ?? settings.pomodoroDuration

  const handleStart = () => {
    dispatch({ type: 'START', duration: displayDuration * 60 })
    setCustomDuration(null)
  }

  const handleStartBreak = () => {
    const phase = getBreakPhase(state.cycleIndex, state.cycleLength)
    dispatch({ type: 'START_BREAK', phase, duration: getBreakDuration(phase, settings) })
  }

  const handleSkipBreak = () => {
    dispatch({ type: 'SKIP_BREAK', duration: displayDuration * 60 })
    setCustomDuration(null)
  }

  return (
    <PageRoot>
      <TimerDisplay state={state} />
      <TimerControls
        status={state.status}
        phase={state.phase}
        duration={displayDuration}
        onStart={handleStart}
        onPause={() => dispatch({ type: 'PAUSE' })}
        onResume={() => dispatch({ type: 'RESUME' })}
        onComplete={() => dispatch({ type: 'COMPLETE' })}
        onStartBreak={handleStartBreak}
        onSkipBreak={handleSkipBreak}
        onDurationChange={setCustomDuration}
      />
    </PageRoot>
  )
}
