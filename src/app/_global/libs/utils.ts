'use server'

import { cookies } from 'next/headers'

/**
 * token 쿠키값 조회
 *
 */
export async function getToken() {
  const cookie = await cookies()

  return cookie.get('token')?.value
}

export async function getUserHash() {
  const cookie = await cookies()

  return cookie.get('User-Hash')?.value
}

export async function fetchSSR(url, options: RequestInit = {}) {
  const token = await getToken()
  if (token) {
    options.headers = options.headers ?? {}
    options.headers['Authorization'] = `Bearer ${token}`
  }

  const userHash = await getUserHash()
  if (userHash) {
    options.headers = options.headers ?? {}
    options.headers['User-Hash'] = userHash
  }

  return fetch(`${process.env.API_URL}${url}`, options)
}

export async function toQueryString(search) {
  if (!search) return ''

  const qs: Array<string> = []
  for (const [key, value] of Object.entries(search)) {
    if (Array.isArray(value)) {
      // 같은 key값에 여러 값이 있는 쿼리 스트링
      for (const v of value) {
        qs.push(`${key}=${v}`)
      }
    } else {
      qs.push(`${key}=${value}`)
    }
  }

  const _qs = qs.join('&')
  return _qs ? `?${_qs}` : ''
}