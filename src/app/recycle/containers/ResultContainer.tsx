'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ResultComponents, type FlatImage } from '../components/ResultList'
import { Button } from '@/app/_global/components/Buttons'
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi'
import color from '@/app/_global/styles/color'
import styled from 'styled-components'
import RecycleGuide from '../components/RecycleGuide'

/* 스타일 정리 S */
const { dark } = color

const ResultWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top:30px;
`

const ResultNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
`

const GuideNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
`

const ArrowButton = styled(Button)`
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;

  svg {
    color: ${dark};
    font-size: 100px;
  }
`

const ButtonWrapper = styled.div`
  width: 100%;
  max-width: 870px;
  display: flex;
  justify-content: flex-end; /* 오른쪽 정렬 */
  margin-top: 12px;
`
/* 스타일 정리 E */

export type DetectedRecycle = {
  seq: number
  gid: string
  data: string
  imageUrl: string
}

type Pagination = { page: number; limit: number; total: number }
type ListData = { items: DetectedRecycle[]; pagination: Pagination }

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1'

export default function ResultContainer() {
  const [page, setPage] = useState(1)
  const LIMIT = 4
  const [data, setData] = useState<ListData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const gid = searchParams.get('gid')

  useEffect(() => {
    if (!gid) return

    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)

        const res = await fetch(`${BASE_URL}/recycle/result?gid=${gid}`, {
          cache: 'no-store',
        })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json: ListData = await res.json()
        if (alive) setData(json)
      } catch (e) {
        if (alive) setError(e)
      } finally {
        if (alive) setLoading(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [gid])

  // 이미지 단위로 평탄화
  const flatImages: FlatImage[] = (data?.items ?? []).flatMap((item) => {
    let categories: { category1: string; category2: string }[] = []
    let images: { url: string; name: string; ext: string }[] = []
    try {
      categories = JSON.parse(item.data || '[]')
    } catch {}
    try {
      images = JSON.parse(item.imageUrl || '[]')
    } catch {}

    console.log(images)

    return images.map((img, idx) => ({
      key: `${item.seq}-${idx}`,
      category: categories[idx]?.category2 ?? '',
      categoryKey: categories[idx]?.category1 ?? '',
      url: img.url,
      name: img.name,
    }))
  })

  useEffect(() => {
    if (flatImages.length > 0 && !selectedCategory) {
      setSelectedCategory(flatImages[0].categoryKey)
    }
  }, [flatImages, selectedCategory])

  // 이미지 기준 페이지네이션
  const start = (page - 1) * LIMIT
  const end = start + LIMIT
  const pageImages = flatImages.slice(start, end)

  const canPrev = page > 1
  const canNext = end < flatImages.length

  if (loading && !data) return <div className="loading">로딩중…</div>
  if (error)
    return <div className="error">에러: {(error as Error)?.message}</div>

  return (
    <>
      <ResultWrapper>
        <ResultNav>
          <ArrowButton
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!canPrev}
          >
            <BiLeftArrow />
          </ArrowButton>

          <ResultComponents
            items={pageImages}
            onSelect={(cat) => setSelectedCategory(cat)}
          />

          <ArrowButton
            onClick={() => setPage((p) => p + 1)}
            disabled={!canNext}
          >
            <BiRightArrow />
          </ArrowButton>
        </ResultNav>

        <ButtonWrapper>
          <Link href="/recycle">
            <Button>다시 찍기</Button>
          </Link>
        </ButtonWrapper>
      </ResultWrapper>

      <GuideNav>
        <RecycleGuide
          items={data?.items ?? []}
          selectedCategory={selectedCategory}
        />
      </GuideNav>
    </>
  )
}
