import { useState } from 'react'
import { Providers } from '@/app/providers'
import { TimerPage } from '@/pages/timer'
import { SettingsPage } from '@/pages/settings'

type Page = 'timer' | 'settings'

export const App = () => {
  const [page, setPage] = useState<Page>('timer')

  return (
    <Providers>
      {page === 'timer' && <TimerPage onNavigate={setPage} />}
      {page === 'settings' && <SettingsPage onNavigate={setPage} />}
    </Providers>
  )
}

export default App
