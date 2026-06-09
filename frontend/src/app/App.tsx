import { useState } from 'react'
import { Providers } from '@/app/providers'
import { Layout } from '@/app/layout'
import { TimerPage } from '@/pages/timer'
import { SettingsPage } from '@/pages/settings'
import type { Page } from '@/app/types'

export const App = () => {
  const [page, setPage] = useState<Page>('timer')

  return (
    <Providers>
      <Layout page={page} onNavigate={setPage}>
        {page === 'timer' && <TimerPage />}
        {page === 'settings' && <SettingsPage />}
      </Layout>
    </Providers>
  )
}

export default App
