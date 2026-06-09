import { useState } from 'react'
import { TimerControls } from '@/features/timer-controls'
import { startTimer, pauseTimer } from '@/shared/api/timer'
import type { Page } from '@/app/types'
import type { TimerStatus } from '@/entities/timer'

interface Props {
  onNavigate: (page: Page) => void
}

export const TimerPage = ({ onNavigate }: Props) => {
  const [status, setStatus] = useState<TimerStatus>('idle')

  const handleStart = async () => {
    await startTimer()
    setStatus('running')
  }

  const handlePause = async () => {
    await pauseTimer()
    setStatus('paused')
  }

  const handleReset = () => {
    setStatus('idle')
  }

  return (
    <div>
      <TimerControls
        status={status}
        onStart={handleStart}
        onPause={handlePause}
        onReset={handleReset}
      />
    </div>
  )
}
