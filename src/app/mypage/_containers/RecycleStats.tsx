'use client'

import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import useFetchCSR from '@/app/_global/hooks/useFetchCSR'

ChartJS.register(ArcElement, Tooltip, Legend)

type RecycleItem = {
  seq: number
  fileUrl: string
  data: string // JSON string
}

export default function RecycleStats() {
  const [items, setItems] = useState<RecycleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { fetchCSR, ready } = useFetchCSR()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (!ready) return
        fetchCSR(`/recycle/my-data`, {
          method: 'GET',
        })
          .then((res) => res.json())
          .then((data) => {
            setItems(data.items || [])
          })
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [ready]) // fetchCSR 넣으면 안 됨.

  if (loading) return <p>로딩중...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  const categoryMap: Record<string, string> = {
    vinyl: '비닐',
    plastic: '플라스틱',
    paper: '종이',
    glass: '유리',
    can: '캔',
  }

  const totalCount = items.length
  const categoryCount: Record<string, number> = {}

  items.forEach((item) => {
    try {
      let parsed: any = JSON.parse(item.data)
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed)
      }

      console.log('parsed', parsed)

      if (Array.isArray(parsed)) {
        parsed.forEach((obj) => {
          Object.values(obj).forEach((val) => {
            if (typeof val === 'string' && val.trim() !== '') {
              const mapped = categoryMap[val.toLowerCase()] || val
              categoryCount[mapped] = (categoryCount[mapped] || 0) + 1
            }
          })
        })
      }
    } catch (e) {
      console.error('data parse error', e)
    }
  })

  const pieData = {
    labels: Object.keys(categoryCount),
    datasets: [
      {
        data: Object.values(categoryCount),
        backgroundColor: [
          '#ff6384',
          '#36a2eb',
          '#ffce56',
          '#4bc0c0',
          '#9966ff',
        ],
      },
    ],
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <h2 style={{ fontSize: '2rem', fontWeight: 600 }}>내 분리수거 통계</h2>
      <p>총 분리수거 횟수: {totalCount}회</p>

      <div style={{ width: '400px', margin: '20px auto' }}>
        {Object.keys(categoryCount).length > 0 ? (
          <Pie data={pieData} />
        ) : (
          <p>카테고리 데이터가 없습니다.</p>
        )}
      </div>
    </div>
  )
}
