import LoginContainer from '../_containers/LoginContainer'
import ContentBox from '@/app/_global/components/ContentBox'
import { MainTitle } from '@/app/_global/components/TitleBox'
import { cookies } from 'next/headers'

interface LoginPageProps {
  searchParams: Promise<{ redirectUrl?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirectUrl } = await searchParams

  const cookieStore = await cookies()
  const errorCookie = cookieStore.get('login_error')?.value

  let errors: any = {}
  if (errorCookie) {
    try {
      errors = JSON.parse(errorCookie)
    } catch {
      errors.global = errorCookie
    }
  }

  return (
    <ContentBox width={800}>
      <MainTitle border="true">로그인</MainTitle>
      <LoginContainer errors={errors} redirectUrl={redirectUrl} />
    </ContentBox>
  )
}
