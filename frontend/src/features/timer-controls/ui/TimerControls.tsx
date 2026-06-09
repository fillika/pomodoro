import type { TimerPhase, TimerStatus } from '@/entities/timer'
import { SplitButton } from './SplitButton'
import { ControlsRow, ActionButton } from './styled'

interface Props {
  status: TimerStatus
  phase: TimerPhase
  duration: number
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onComplete: () => void
  onStartBreak: () => void
  onSkipBreak: () => void
  onDurationChange: (duration: number | null) => void
}

export const TimerControls = ({
  status,
  phase,
  duration,
  onStart,
  onPause,
  onResume,
  onComplete,
  onStartBreak,
  onSkipBreak,
  onDurationChange,
}: Props) => {
  const completeLabel = 'Завершить'

  if (status === 'idle' || status === 'break_done') {
    return (
      <ControlsRow>
        <SplitButton
          label="Начать"
          duration={duration}
          onAction={onStart}
          onDurationChange={onDurationChange}
        />
      </ControlsRow>
    )
  }

  if (status === 'focusing' || status === 'on_break') {
    return (
      <ControlsRow>
        <ActionButton $variant="ghost" onClick={onPause}>
          Пауза
        </ActionButton>
        <ActionButton $variant="ghost" onClick={onComplete}>
          {completeLabel}
        </ActionButton>
      </ControlsRow>
    )
  }

  if (status === 'paused') {
    return (
      <ControlsRow>
        <ActionButton onClick={onResume}>Продолжить</ActionButton>
        <ActionButton $variant="ghost" onClick={onComplete}>
          {completeLabel}
        </ActionButton>
      </ControlsRow>
    )
  }

  if (status === 'focus_done') {
    return (
      <ControlsRow>
        <ActionButton onClick={onStartBreak}>Перерыв</ActionButton>
        <ActionButton $variant="ghost" onClick={onSkipBreak}>
          Фокус
        </ActionButton>
      </ControlsRow>
    )
  }

  return null
}
