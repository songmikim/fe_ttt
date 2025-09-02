'use client'
import { useSearchParams, usePathname } from 'next/navigation'
import useUser from '../hooks/useUser'
import ContentBox from '../components/ContentBox'
import { MainTitle } from '../components/TitleBox'
import LoginContainer from '@/app/member/_containers/LoginContainer'
export default function UserOnlyContainer({ children }) {
  const { isLogin } = useUser()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  let qs = searchParams.toString() ?? ''
  qs = qs ? `?${qs}` : qs
  const redirectUrl = `${pathname}${qs}`

  return isLogin ? (
    children
  ) : (
    <ContentBox width={420}>
      <MainTitle center="true" className="title-font">
        로그인
      </MainTitle>
      <LoginContainer redirectUrl={redirectUrl} />
    </ContentBox>
  )
}