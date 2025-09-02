'use client'
import { useEffect, useState } from 'react'
import { getToken, getUserHash } from '../libs/utils'
import { useRouter } from 'next/navigation'

export default function useFetchCSR() {
  const [token, setToken] = useState<string | undefined>()
  const [hash, setHash] = useState<string | number | undefined>()
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      setToken(await getToken())
      setHash(await getUserHash())
      setReady(true)
    })()
  }, [])

  return {
    ready,
    fetchCSR: async (url: string, options: RequestInit = {}) => {
      /// if (!ready) throw new Error('Auth headers not ready')

      const headers: HeadersInit = { ...(options.headers || {}) }
      if (token) headers['Authorization'] = `Bearer ${token}`
      if (hash) headers['User-Hash'] = hash

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
        ...options,
        headers,
      })

      if (res.status === 401) {
        router.push('/member/login?reload=true')
        throw new Error('토큰이 만료되어, 로그인 페이지로 돌아갑니다.')
      }

      return res
    },
  }
}
