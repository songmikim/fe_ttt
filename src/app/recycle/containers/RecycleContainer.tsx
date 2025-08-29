'use client'

import { useCookies } from 'react-cookie'
import { useEffect, useRef, useTransition, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { processRecycle } from '../_services/actions'
import UserContext from '@/app/_global/contexts/UserContext'

const MAX_GUEST_ATTEMPTS = 3

const RecycleContainer = () => {
  const [cookies, setCookie] = useCookies(['guestCount'])
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const hasRunRef = useRef(false)

  const userCtx = useContext(UserContext)
  const loggedMember = userCtx?.states?.loggedMember

  useEffect(() => {
    if (hasRunRef.current) return
    hasRunRef.current = true

    // 로그인된 상태면 분리수거 감지 페이지로 즉시 이동(라우팅)
    if (loggedMember) {
      router.replace('/recycle/detect?reload=true')
      return
    }

    // 쿠키에 저장된 guestCount(문자열)를 10진수 정수로 변환
    // 값이 비어있거나(undefined/null) 없으면 기본값 '0'을 사용
    const curr = Number.parseInt(cookies.guestCount ?? '0', 10)

    // parseInt 결과가 NaN이면(숫자 아님) 0으로 보정, 아니면 그대로 사용
    const count = Number.isNaN(curr) ? 0 : curr

    // 허용 횟수가 넘어가면 로그인 페이지로 즉시 이동(라우팅)
    if (count >= MAX_GUEST_ATTEMPTS) {
      router.replace('/member/login?reload=true')
      return
    }

    // guestCount 증가 (CSR)
    setCookie('guestCount', String(count + 1), {
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30일
    })

    // 서버에서 최종 검증 및 redirect
    startTransition(async () => {
      await processRecycle()
    })
  }, [cookies.guestCount, router, setCookie, loggedMember])

  return <p>{pending ? '이동 중…' : '준비 중…'}</p>
}

export default RecycleContainer
