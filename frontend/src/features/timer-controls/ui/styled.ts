import styled from 'styled-components'

export const ControlsRow = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  height: 32px;
`

export const SplitContainer = styled.div`
  display: flex;
  border-radius: 6px;
  overflow: hidden;
`

export const SplitMain = styled.button`
  padding: 6px 18px;
  border: none;
  border-radius: 0;
  background: #1668dc;
  color: #fff;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: #1554ad;
  }
`

export const SplitDivider = styled.div`
  width: 1px;
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
`

export const SplitDuration = styled.button`
  padding: 6px 10px;
  border: none;
  border-radius: 0;
  background: #1668dc;
  color: rgba(255, 255, 255, 0.75);
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;

  &:hover {
    background: #1554ad;
    color: #fff;
  }
`

export const ActionButton = styled.button<{ $variant?: 'default' | 'ghost' }>`
  padding: 6px 18px;
  border: none;
  border-radius: 6px;
  background: ${({ $variant }) => ($variant === 'ghost' ? 'rgba(255,255,255,0.08)' : '#1668dc')};
  color: #fff;
  font-size: 13px;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s;

  &:hover {
    background: ${({ $variant }) => ($variant === 'ghost' ? 'rgba(255,255,255,0.14)' : '#1554ad')};
  }
`
