'use client'

import React, { useEffect, useState } from 'react'
import { RecycleList, DetectedRecycle } from '../_components/RecycleList'
import Pagination from '@/app/_global/components/Pagination'
import useFetchCSR from '@/app/_global/hooks/useFetchCSR'

export default function RecycleContainer() {
  const [items, setItems] = useState<DetectedRecycle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<any>()

  const { fetchCSR, ready } = useFetchCSR()

  /** 페이지네이션 상태 */
  const [page, setPage] = useState(1)
  const pageSize = 12 // 한 페이지당 보여줄 개수

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      try {
        if (!ready) return
        const res = await fetchCSR(
          `/recycle/my-data?page=${page}&limit=${pageSize}`,
          {
            method: 'GET',
          },
        )
        if (!res.ok) throw new Error('데이터 조회 실패')
        const data = await res.json()
        setItems(data.items)
        setPagination(data.pagination)
      } catch (err: any) {
        console.error(err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [ready, page]) // fetchCSR 넣으면 무한루프됨.

  if (loading) return <p>로딩 중...</p>
  if (error) return <p>에러: {error}</p>

  return (
    <>
      <RecycleList items={items} />
      <Pagination pagination={pagination} onClick={setPage} />
    </>
  )
}
