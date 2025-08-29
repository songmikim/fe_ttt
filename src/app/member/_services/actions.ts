'use server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { fetchSSR } from '@/app/_global/libs/utils'

/**
 * 회원가입 처리
 *
 */
export async function processJoin(errors, formData: FormData) {
  errors = {}
  const params: any = {}

  // 필요한 필드와 값만 추출
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('$ACTION_')) continue
    let _value: string | boolean = value.toString()
    if (['true', 'false'].includes(_value)) {
      _value = _value === 'true'
    }

    params[key] = _value
  }

  let hasErrors: boolean = false
  const isSocial = params?.socialChannel && params?.socialToken // 소셜 연결 회원가입 여부

  // 필수 항목 검증 S
  type RequiredFieldType = {
    email: string
    password?: string
    confirmPassword?: string
    name: string
    mobile: string
    termsAgree: string
  }

  const requiredFields: RequiredFieldType = {
    email: '이메일을 입력하세요.',
    password: '비밀번호를 입력하세요.',
    confirmPassword: '비밀번호를 확인하세요.',
    name: '회원이름을 입력하세요.',
    mobile: '휴대전화번호를 입력하세요.',
    termsAgree: '회원가입 약관에 동의하세요.',
  }

  if (isSocial) {
    // 소셜 연결 회원가입인 경우 비밀번호, 비밀번호 확인은 필수 X
    delete requiredFields.password
    delete requiredFields.confirmPassword
  }

  for (const [field, message] of Object.entries(requiredFields)) {
    if (
      !params[field] ||
      (typeof params[field] === 'string' && !params[field].trim())
    ) {
      hasErrors = true

      errors[field] = errors[field] ?? []
      errors[field].push(message)
    }
  }
  // 필수 항목 검증 E

  // 비밀번호, 비밀번호 확인 일치 여부
  if (!isSocial) {
    const password = params.password?.trim()
    if (password && password !== params.confirmPassword?.trim()) {
      errors.confirmPassword = errors.confirmPassword ?? []
      errors.confirmPassword.push('비밀번호가 일치하지 않습니다.')
      hasErrors = true
    }
  }

  // 검증 실패시에는 에레 메세지를 출력하기 위한 상태값을 반환
  if (hasErrors) {
    return errors
  }

  // 회원 가입 처리를 위해  API 서버에 요청
  try {
    const apiUrl = `${process.env.API_URL}/member`
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })

    // API 백앤드에서 검증 실패시 메세지
    if (res.status !== 201) {
      const { messages } = await res.json()
      return messages
    }
  } catch (err: any) {
    return { global: err?.message }
  }

  // 회원가입 완료시 로그인 페이지로 이동
  redirect('/member/login')
}

/**
 * 로그인 처리
 *
 * @param errors
 * @param formData
 */
export async function processLogin(errors, formData: FormData) {
  errors = {}
  let hasErrors: boolean = false

  const params: { email?: string; password?: string; redirectUrl?: string } = {
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
  }

  // 유효성 검사 S
  if (!params.email || !params.email.trim()) {
    errors.email = '이메일을 입력하세요.'
    hasErrors = true
  }

  if (!params.password || !params.password.trim()) {
    errors.password = '비밀번호를 입력하세요.'
    hasErrors = true
  }
  // 유효성 검사 E

  if (hasErrors) {
    return errors
  }

  // API 백앤드로 요청을 보냄
  const apiUrl = `${process.env.API_URL}/member/token`
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (res.status === 200) {
    // 로그인 성공 -> JSON 응답 받기
    const data = await res.json()

    // 토큰 꺼내서 쿠키 저장
    const cookie = await cookies()
    cookie.set('token', data.token, {
      httpOnly: true,
      path: '/',
    })

    revalidateTag('loggedMember')

    // 로그인 성공 시 페이지 이동 (forceChangePassword 여부에 따른 처리)
    if (!data.forceChangePassword) {
      // 비밀번호로 로그인
      // - redurectUrl이 있다면 그 주소로 이동 아니면 메인페이지(/)로 이동
      let redirectUrl = formData.get('redirectUrl')?.toString()
      redirectUrl = redirectUrl ? redirectUrl : '/'
      redirect(redirectUrl + '?reload=true')
    } else {
      // 임시 비밀번호로 로그인
      // - 일단 마이페이지 정보 수정 페이지로 이동
      redirect('/mypage/profile?reload=true')
    }
  } else {
    // 로그인 실패 처리
    const json = await res.json()
    return json.messages ? json.messages : { global: json.messages }
  }
}

/**
 * 로그인한 회원 정보를 조회
 *   - 요청 헤더 Authorization: Bearer 토큰
 */
export async function getLoggedMember() {
  try {
    const res = await fetchSSR('/member', {
      method: 'GET',
      next: {
        tags: ['loggedMember'],
      },
    })

    if (res.status === 200) {
      return await res.json()
    }
  } catch (err) {
    console.log('getLoggedMember() error:', err)
  }
}
