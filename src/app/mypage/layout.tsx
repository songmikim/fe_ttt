import type { Metadata } from 'next'
import Side from './outlines/Side'

import './mypage.css'

export const metadata: Metadata = {
  title: '마이페이지',
}

export default function MyPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Side />
      <section>{children}</section>
    </>
  )
}
