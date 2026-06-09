import { Button, Space } from 'antd'
import type { TimerStatus } from '@/entities/timer'

interface Props {
  status: TimerStatus
  onStart: () => void
  onPause: () => void
  onReset: () => void
}

export const TimerControls = ({ status, onStart, onPause, onReset }: Props) => {
  return (
    <Space>
      <Button type="primary" onClick={onStart} disabled={status === 'running'}>
        Start
      </Button>
      <Button onClick={onPause} disabled={status !== 'running'}>
        Pause
      </Button>
    </Space>
  )
}
