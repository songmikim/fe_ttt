'use server'
import { redirect } from 'next/navigation'
import { toPlainObj } from '@/app/_global/libs/commons'
import { fetchSSR } from '@/app/_global/libs/utils'
import { getBoardConfig } from './BoardConfig'

/**
 * 게시글 등록, 수정 처리
 * @param errors
 * @param formData
 */
export async function processUpdate(errors: any, formData: FormData) {
  errors = {}
  const params = toPlainObj(formData)

  let hasErrors: boolean = false
  const board = await getBoardConfig(params.bid)
  if (!board.bid) {
    errors.global = '게시판을 찾을 수 없습니다.'
    hasErrors = true
  }

  // 유효성 검사 S
  const requiredFields = {
    bid: '잘못된 접근입니다.',
    gid: '잘못된 접근입니다.',
    poster: '작성자를 입력하세요.',
    subject: '제목을 입력하세요.',
    content: '내용을 입력하세요.',
  }

  for (const [field, message] of Object.entries(requiredFields)) {
    if (!params[field]?.trim()) {
      errors[field] = message
      hasErrors = true
    }
  }

  const { mode } = params
  if (mode === 'update' && !params.seq) {
    errors.seq = '잘못된 접근입니다.'
    hasErrors = true
  }

  if (hasErrors) {
    return errors
  }

   // 필수 항목 검증 S
  // API 백엔드에 처리 요청
  const res = await fetchSSR('/board/save', {
    method: params.mode === 'update' ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
  console.log(res)

const data = await res.json()
  let redirectUrl = `/board/list/${board.bid}`
  if ([200, 201].includes(res.status)) {
    // 게시글 등록, 수정 성공
    const { afterWritingRedirect } = board
    redirectUrl = afterWritingRedirect ? `/board/view/${data.seq}` : redirectUrl
  } else {
    return data.messages
  }

  redirect(redirectUrl)
}

/**
 * 비회원 비밀번호 확인 처리
 *
 * @param errors
 * @param formData
 */
export async function processPassword(errors: any, formData: FormData) {
  errors = {}
  const params = toPlainObj(formData)
  let hasErrors: boolean = false
  const { seq, mode, password } = params
  if (
    !seq ||
    !mode ||
    !['update', 'delete', 'comment_update', 'comment_delete'].includes(mode)
  ) {
    errors.global = '잘못된 접근입니다.'
    hasErrors = true
  }

  if (!password?.trim()) {
    errors.password = '비밀번호를 입력하세요.'
    hasErrors = true
  }

  if (hasErrors) {
    return errors
  }

  const requestUrl = mode.startsWith('comment_')
    ? `/board/password/comment/${seq}`
    : `/board/password/${seq}`

  const res = await fetchSSR(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),  // ✅ password만 전송
  })
  console.log("res",res)

  if (res.status !== 204) {
    // 비회원 비밀번호 인증 실패
    const data = await res.json()
    return { password: data.messages }
  }
  console.log("피카츄")

  let redirectUrl: string = '/board/'
  switch (mode) {
    case 'delete':
      redirectUrl += `delete/${seq}`
      break
    case 'comment_delete':
    case 'comment_update':
      break
    default:
      redirectUrl += `update/${seq}`
  }
  console.log("redirectUrl",redirectUrl)

  redirect(redirectUrl)
}