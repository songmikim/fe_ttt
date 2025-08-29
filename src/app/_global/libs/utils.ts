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