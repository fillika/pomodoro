import type { Page } from '@/app/types'
import { Nav, NavItem } from './styled'

interface Props {
  current: Page
  onNavigate: (page: Page) => void
}

const ITEMS: { key: Page; label: string }[] = [
  { key: 'timer', label: 'Главная' },
  { key: 'settings', label: 'Настройки' },
]

export const Toolbar = ({ current, onNavigate }: Props) => (
  <Nav>
    {ITEMS.map(({ key, label }) => (
      <NavItem key={key} $active={current === key} onClick={() => onNavigate(key)}>
        {label}
      </NavItem>
    ))}
  </Nav>
)
