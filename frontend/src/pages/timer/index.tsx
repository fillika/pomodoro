import { useEffect, useState } from 'react'
import { EventsOn } from '@wailsjs/runtime/runtime'
import { TimerDisplay, getBreakPhase, getBreakDuration, getInitialState } from '@/entities/timer'
import { TimerControls } from '@/features/timer-controls'
import { StartFocus, Pause, Resume, StartBreak, SkipBreak, Complete, GetState } from '@/shared/api/timer'
import { DEFAULT_SETTINGS } from '@/shared/config'
import type { TimerState } from '@/entities/timer'
import { PageRoot } from './styled'

export const TimerPage = () => {
  const settings = DEFAULT_SETTINGS
  const [state, setState] = useState<TimerState>(getInitialState(settings))
  const [customDuration, setCustomDuration] = useState<number | null>(null)

  useEffect(() => {
    GetState().then((s) => setState(s as unknown as TimerState))
    const off = EventsOn('timer:tick', (s: TimerState) => setState(s))
    return off
  }, [])

  const displayDuration = customDuration ?? settings.pomodoroDuration

  const handleStart = () => {
    StartFocus(displayDuration * 60)
    setCustomDuration(null)
  }

  const handleStartBreak = () => {
    const phase = getBreakPhase(state.cycleIndex, state.cycleLength)
    StartBreak(phase, getBreakDuration(phase, settings))
  }

  const handleSkipBreak = () => {
    SkipBreak(displayDuration * 60)
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
        onPause={() => Pause()}
        onResume={() => Resume()}
        onComplete={() => Complete()}
        onStartBreak={handleStartBreak}
        onSkipBreak={handleSkipBreak}
        onDurationChange={setCustomDuration}
      />
    </PageRoot>
  )
}
