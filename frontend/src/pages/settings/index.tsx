import type { Page } from '@/app/types'

interface Props {
  onNavigate: (page: Page) => void
}

export const SettingsPage = ({ onNavigate }: Props) => {
  return <div>SettingsPage</div>
}
