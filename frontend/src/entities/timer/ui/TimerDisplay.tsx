import { getPhaseLabel, formatTime } from '../model/transitions'
import type { TimerState } from '../model/types'
import { DisplayRoot, PhaseLabel, TimeValue } from './styled'

const SHOW_TIME: TimerState['status'][] = ['focusing', 'paused', 'on_break']

interface Props {
  state: TimerState
}

export const TimerDisplay = ({ state }: Props) => {
  const label = getPhaseLabel(state)
  const showTime = SHOW_TIME.includes(state.status)

  return (
    <DisplayRoot>
      <PhaseLabel>{label}</PhaseLabel>
      {showTime && <TimeValue>{formatTime(state.remaining)}</TimeValue>}
    </DisplayRoot>
  )
}
