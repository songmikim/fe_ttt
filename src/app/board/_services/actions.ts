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

  const redirectUrl = `/board/list/${board.bid}`

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
  const { seq, mode, password, bid } = params // bid 추가
  
  // 유효성 검사
  if (!seq || !mode || !['update', 'delete', 'comment_update', 'comment_delete'].includes(mode)) {
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

  // 비밀번호 확인 API 호출
  const requestUrl = mode.startsWith('comment_')
    ? `/board/password/comment/${seq}`
    : `/board/password/${seq}`

  const res = await fetchSSR(requestUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ password }),
  })

  if (res.status !== 204) {
    const data = await res.json()
    return { password: data.messages }
  }

  // 성공 시 mode에 따른 처리
  if (mode === 'update') {
    redirect(`/board/update/${seq}`)
  } else if (mode === 'delete') {
    // 바로 삭제 처리
    try {
      const deleteRes = await fetchSSR(`/board/delete/${seq}`, {
      method: 'DELETE',
      })

    const responseText = await deleteRes.text()
    const result = responseText ? JSON.parse(responseText) : {}
    } catch (error) {
      console.error("삭제 에러:", error)
      return { global: '삭제 중 오류가 발생했습니다.' }
      throw error
    }
    
    redirect(`/board/list/${bid}`)
  }  else if (mode.startsWith('comment_')) {
    // 댓글 관련 처리
    redirect(`/board/view/${seq}`)
  }
}

export async function processComment(errors: any, formData: FormData) {
  errors = {}
  const params = toPlainObj(formData)
  let hasErrors: boolean = false

  // 유효성 검사
  const { seq, boardDataSeq, commenter, content, mode, guest, guestPw } = params
  if (!boardDataSeq || !mode || (mode === 'comment_update' && !seq)) {
    errors.global = '잘못된 접근입니다.'
    hasErrors = true
  }

  if (!commenter?.trim()) {
    errors.commenter = '작성자를 입력하세요.'
    hasErrors = true
  }

  if (!content?.trim()) {
    errors.content = '댓글을 입력하세요.'
    hasErrors = true
  }

  if (guest && !guestPw?.trim()) {
    errors.guestPw = '비밀번호를 입력하세요.'
    hasErrors = true
  }

  if (hasErrors) {
    return errors
  }

  const res = await fetchSSR(`/comment/comment/${params.boardDataSeq}`, {
    method: mode === 'comment_update' ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })

  if (res.status === 204) {
    // 성공 - 본문 없음
    redirect(`/board/view/${params.boardDataSeq}`)
    return
  }

  // 에러인 경우에만 JSON 파싱
  if (res.status >= 400) {
    const data = await res.json()
    return data.messages
  }
}

export async function processDelete(seq, bid) {
  // 삭제 로직
  const deleteRes = await fetchSSR(`/board/delete/${seq}`, {
    method: 'DELETE',
  })

  if (deleteRes.status === 200) {
    redirect(`/board/list/${bid}`)
  }
}