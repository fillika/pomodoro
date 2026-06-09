import { ConfigProvider, theme } from 'antd'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

export const Providers = ({ children }: Props) => {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      {children}
    </ConfigProvider>
  )
}
