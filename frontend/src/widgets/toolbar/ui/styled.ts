import styled from 'styled-components'

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0;
`

export const NavItem = styled.button<{ $active: boolean }>`
  padding: 4px 10px;
  border: none;
  border-radius: 0;
  background: ${({ $active }) => ($active ? 'rgba(255,255,255,0.12)' : 'transparent')};
  color: ${({ $active }) => ($active ? '#fff' : 'rgba(255,255,255,0.55)')};
  font-size: 13px;
  font-family: inherit;
  line-height: 1.4;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    color: rgba(255, 255, 255, 0.9);
  }
`
