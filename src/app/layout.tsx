import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import './globals.css'
import StyledComponentsRegistry from './registry'
import { getLoggedMember } from './member/_services/actions'
import { UserProvider } from './_global/contexts/UserContext'
import { CommonProvider } from './_global/contexts/CommonContext'
import LayoutContainer from './_global/wrappers/LayoutContainer'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic' // 모든 페이지는 SSR 강제

export const metadata: Metadata = {
  title: 'vinllage',
  description:
    'AI 기반 카메라 인식을 통해 쓰레기를 올바르게 분리배출할 수 있도록 돕는 친환경 플랫폼',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const member = await getLoggedMember()
  const cookie = await cookies()
  if (member == null && cookie.has('token')) {
    redirect('/member/api/logout?redirectUrl=/session-expired')
  }

  return (
    <html lang="ko">
      <body id="body">
        <StyledComponentsRegistry>
          <CommonProvider>
            <UserProvider
              loggedMember={member}
              token={cookie.get('token')?.value}
            >
              <LayoutContainer>{children}</LayoutContainer>
            </UserProvider>
          </CommonProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
