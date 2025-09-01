import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import KakaoApi from '../../_service/KakaoApi'
import NaverApi from '../../_service/NaverApi'
import { fetchSSR } from '@/app/_global/libs/utils'

export async function GET(request: NextRequest) {
  const channel = request.nextUrl.pathname.split('/')[3].toUpperCase()
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  let redirectUrl = searchParams.get('state') ?? '/'
  redirectUrl += redirectUrl.includes('?') ? '&' : '?'
  // redirectUrl += 'reload=true'
  const api = channel === 'NAVER' ? new NaverApi() : new KakaoApi()

  if (redirectUrl.endsWith('?')) {
    redirectUrl = redirectUrl.slice(0, -1)
  }

  try {
    if (!code) {
      throw new Error('인증코드 누락')
    }

    const token = await api.getToken(code)
    if (!token) {
      throw new Error('Access Token 발급 실패')
    }

    const id = await api.getProfile(token)
    const res = await fetchSSR('/member/social/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        socialChannel: channel,
        socialToken: id,
      }),
    })

    if (res.status === 200) {
      // 로그인 처리
      const data = await res.json()
      const cookie = await cookies()
      cookie.set('token', data.token, {
        httpOnly: true,
        path: '/',
      })
    } else {
      const json = await res.json()

      console.log('메시지', json.messages)

      if (
        json.messages &&
        Array.isArray(json.messages.global) &&
        json.messages.global.includes('탈퇴 진행 중인 계정입니다.')
      ) {
        const cookie = await cookies()
        cookie.set('login_error', JSON.stringify(json.messages), {
          httpOnly: false, // 클라에서 읽어야 하므로 false
          path: '/',
          maxAge: 5, // 5초만 유지
        })
        redirectUrl = `/member/login?redirectUrl=${redirectUrl}`
      } else {
        // 회원이 존재하지 않는 경우, 소셜 가입을 진행
        redirectUrl = `/member/join?channel=${channel}&token=${id}`
      }
    }
  } catch (err) {
    console.error(err)
    redirectUrl = `/member/login?redirectUrl=${redirectUrl}`
  }

  return NextResponse.redirect(
    new URL(redirectUrl, process.env.NEXT_PUBLIC_DOMAIN),
    302,
  )
}
