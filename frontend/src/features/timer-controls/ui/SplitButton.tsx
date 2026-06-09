import { useState, useEffect } from 'react'
import { Popover, InputNumber } from 'antd'
import styled from 'styled-components'
import { SplitContainer, SplitMain, SplitDivider, SplitDuration } from './styled'

interface Props {
  label: string
  duration: number
  onAction: () => void
  onDurationChange: (duration: number | null) => void
}

const ActionConfirm = styled.button`
  padding: 2px 8px;
  border: none;
  border-radius: 4px;
  background: #1668dc;
  color: #fff;
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
`

export const SplitButton = ({ label, duration, onAction, onDurationChange }: Props) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState<number | null>(duration)

  useEffect(() => {
    if (open) setValue(duration)
  }, [open, duration])

  const handleConfirm = () => {
    onDurationChange(value)
    setOpen(false)
  }

  const popoverContent = (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <InputNumber
        min={1}
        max={120}
        value={value}
        onChange={setValue}
        size="small"
        style={{ width: 64 }}
        onPressEnter={handleConfirm}
        autoFocus
      />
      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>мин</span>
      <ActionConfirm onClick={handleConfirm}>OK</ActionConfirm>
    </div>
  )

  return (
    <SplitContainer>
      <SplitMain onClick={onAction}>{label}</SplitMain>
      <SplitDivider />
      <Popover
        content={popoverContent}
        trigger="click"
        open={open}
        onOpenChange={setOpen}
        placement="bottom"
      >
        <SplitDuration>{duration} мин</SplitDuration>
      </Popover>
    </SplitContainer>
  )
}
