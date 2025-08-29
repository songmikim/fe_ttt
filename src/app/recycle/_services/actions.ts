'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getLoggedMember } from '@/app/member/_services/actions'

type DetectDataSuccess = {
  gid: string
  count: number
  ids: string[]
}

type DetectDataError = {
  global: string
}

export type DetectDataResponse = DetectDataSuccess | DetectDataError

/**
 * 감지된 분리수거 데이터 저장 처리
 *
 * - API 서버의 `/recycle` 엔드포인트로 FormData 전송
 * - 로그인 상태라면 JWT 토큰(Authorization 헤더) 함께 전달
 * - 성공 시: 저장된 결과(DetectedRecycle) JSON 반환 (+ Member 정보는 @JsonIgnore)
 * - 실패 시: 서버에서 내려준 에러 메시지 또는 상태 코드 메시지 반환
 */
export async function processDetectData(
  formData: FormData,
): Promise<DetectDataResponse> {
  try {
    const apiUrl = `${process.env.API_URL}/recycle`

    // 쿠키에서 JWT 토큰 추출
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value

    // API 요청
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    })

    // 응답 상태 확인
    if (!res.ok) {
      // 에러 응답일 경우: 서버 메시지 파싱
      const { messages } = await res.json().catch(() => ({}))
      return messages ?? { global: `Upload failed with ${res.status}` }
    }

    // 정상 저장된 경우: JSON 결과 반환
    return (await res.json()) as DetectDataSuccess
  } catch (err: any) {
    // 네트워크 오류 등 예외 처리
    return { global: err?.message }
  }
}

/**
 * Recycle 페이지 진입 시
 * - 회원: 항상 허용
 * - 비회원: 횟수 제한
 */
const MAX_GUEST_ATTEMPTS = 3
export async function processRecycle() {
  const cookie = await cookies()
  const member = await getLoggedMember()

  // 로그인되어 있으면 바로 리다이렉트
  if (member) {
    redirect('/recycle/detect?reload=true')
  }

  // 쿠키 옵션 (로컬 http에서는 secure=false)
  const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30일
  }

  // 게스트 ID 없으면 발급
  if (!cookie.get('guestId')) {
    cookie.set('guestId', crypto.randomUUID(), base)
  }

  // 현재 카운트
  const curr = cookie.get('guestCount')?.value
  const count = curr ? parseInt(curr, 10) : 0

  // 허용 횟수 넘어가면 로그인 페이지로 이동
  if (count >= MAX_GUEST_ATTEMPTS) {
    redirect('/member/login?reload=true')
  } else {
    redirect('/recycle/detect?reload=true')
  }
}
