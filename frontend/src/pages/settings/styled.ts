import styled from 'styled-components'

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`

export const PageTitle = styled.h2`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.85);
`

export const SaveButton = styled.button<{ $dirty: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: ${({ $dirty }) => ($dirty ? '#fff' : 'rgba(255,255,255,0.2)')};
  cursor: ${({ $dirty }) => ($dirty ? 'pointer' : 'default')};
  font-size: 16px;
  transition:
    background 0.15s,
    color 0.15s;

  &:hover {
    background: ${({ $dirty }) => ($dirty ? 'rgba(255,255,255,0.1)' : 'transparent')};
  }
`

export const FieldList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const FieldRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const FieldLabel = styled.label`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
`

export const FieldUnit = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  width: 24px;
`
