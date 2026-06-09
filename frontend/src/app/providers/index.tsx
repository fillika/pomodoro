import { ConfigProvider } from 'antd'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export const Providers = ({ children }: Props) => {
  return <ConfigProvider>{children}</ConfigProvider>
}
