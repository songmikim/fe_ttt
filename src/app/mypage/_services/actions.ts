'use server'
import useAlertDialog from '@/app/_global/hooks/useAlertDialog'
import { fetchSSR } from '@/app/_global/libs/utils'

export async function processProfile(errors, formData: FormData) {
  errors = {}
  const params: any = {}

  // 필요한 필드와 값만 추출
  for (const [key, value] of formData.entries()) {
    if (key.startsWith('$ACTION_')) continue
    if (key === 'email') continue // 폼데이터에서 email은 제외
    params[key] = value.toString()
  }

  let hasErrors: boolean = false
  if (!params.name?.trim()) {
    errors.name = '회원명을 입력하세요.'
    hasErrors = true
  }

  if (!params.mobile.trim()) {
    errors.mobile = '휴대전화번호를 입력하세요.'
    hasErrors = true
  }

  if (params.password) {
    if (!params.confirmPassword?.trim()) {
      errors.confirmPassword = '비밀번호를 확인해 주세요.'
    } else if (params.password !== params.confirmPassword) {
      errors.confirmPassword = '비밀번호가 일치하지 않습니다.'
      hasErrors = true
    }
  }

  if (hasErrors) {
    return errors
  }

  const res = await fetchSSR('/member/update', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  const data = await res.json()
  if (res.status === 200) {
    data.status = 'DONE'
    return data
  }
  return data.messages
}
