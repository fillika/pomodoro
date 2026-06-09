import styled from 'styled-components'

export const DisplayRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 88px;
`

export const PhaseLabel = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  min-height: 20px;
`

export const TimeValue = styled.div`
  font-size: 48px;
  font-weight: 600;
  letter-spacing: 2px;
  color: #fff;
  font-variant-numeric: tabular-nums;
`
