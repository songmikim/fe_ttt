'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import LayerPopup from '@/app/_global/components/LayerPopup'
import ContentBox from '@/app/_global/components/ContentBox'
import NoticeModal from '@/app/main/_components/NoticeModal'
import type { BoardDataType } from '@/app/board/_types/BoardType'
import useFetchCSR from '@/app/_global/hooks/useFetchCSR'

import {
  PageWrapper,
  MainSection,
  Counter,
  SubText,
  StyledButton,
} from './MainContainerStyle'
import { fetchRecycleTotalCount } from '../services/actions'

export  default function MainContainer() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [items, setItems] = useState<Array<BoardDataType>>([])
  const { fetchCSR, ready } = useFetchCSR()
  const onClick = useCallback(() => router.push('/recycle'), [router])

  useEffect(() => {
    fetchRecycleTotalCount()
      .then(setTotalCount)
      .catch((err) => {
        console.error('분리수거 카운트 조회 실패:', err)
      })
  }, [])

  useEffect(() => {
    if (!ready) return
    fetchCSR('/board/list/notice?limit=5')
      .then((res) => res.json())
      .then((data) => setItems(data.items ?? []))
      .catch((err) => {
        console.error('공지사항 불러오기 실패:', err)
      })
  }, [fetchCSR, ready])


  return (
    <PageWrapper>
      <NoticeModal items={items} />
      <LayerPopup
        isOpen={isOpen}
        title="공지사항"
        onClose={() => setIsOpen(false)}
      >
        <h3>내용</h3>
      </LayerPopup>

      <ContentBox width={720}>
        <MainSection>
          <SubText>촬영만으로 간편하게, 환경을 지켜보세요</SubText>
          <Counter>누적 분리수거 {totalCount}회</Counter>
          <StyledButton
            onClick={onClick}
          >
            분리수거 하기
          </StyledButton>
          <StyledButton
            onClick={() => setIsOpen(true)}
          >
            공지사항 열기
          </StyledButton>
        </MainSection>
      </ContentBox>
    </PageWrapper>
  )
}
