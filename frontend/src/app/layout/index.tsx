import { Layout as AntLayout } from 'antd'
import type { ReactNode } from 'react'
import { Toolbar } from '@/widgets/toolbar'
import type { Page } from '@/app/types'
import styles from './index.module.css'

interface Props {
  children: ReactNode
  page: Page
  onNavigate: (page: Page) => void
}

export const Layout = ({ children, page, onNavigate }: Props) => {
  return (
    <AntLayout className={styles.layout}>
      <AntLayout.Header className={styles.header}>
        <Toolbar current={page} onNavigate={onNavigate} />
      </AntLayout.Header>
      <AntLayout.Content className={styles.content}>{children}</AntLayout.Content>
    </AntLayout>
  )
}
