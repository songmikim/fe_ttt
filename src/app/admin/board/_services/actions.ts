'use server'
import { redirect } from 'next/navigation'
import { fetchSSR } from '@/app/_global/libs/utils'

export async function processBoardConfig(errors, formData: FormData) {
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

  // 필수 항목 검증 S
  let hasErrors: boolean = false

  if (!params.bid || !params.bid.trim()) {
    errors.bid = '게시판 아이디를 입력하세요.'
    hasErrors = true
  }

  if (!params.name || !params.name.trim()) {
    errors.name = '게시판 이름을 입력하세요.'
    hasErrors = true
  }

  if (hasErrors) {
    return errors
  }
  // 필수 항목 검증 S
  // API 백엔드에 처리 요청
  const res = await fetchSSR('/board/update/config', {
    method: params.mode === 'update' ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  // 처리 실패시
  if (res.status !== 200 && res.status !== 201) {
    return await res.json()
  }

  // 처리 성공시 - 게시판 설정 목록으로 이동
  redirect('/admin/board')
}