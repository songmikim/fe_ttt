'use client'
import styled from 'styled-components'
import React, { useCallback, useState } from 'react'
import type { BoardConfigType } from '@/app/board/_types/BoardType'
import Pagination from '@/app/_global/components/Pagination'
import BoardItems from '../_components/BoardItems'
import BoardSearchForm from '../_components/BoardSearchForm'
import useAlertDialog from '@/app/_global/hooks/useAlertDialog'
import useConfirmDialog from '@/app/_global/hooks/useConfirmDialog'

type PropType = {
  items?: Array<BoardConfigType>
  pagination?: any
  search?: any
}

const SearchWrapper = styled.div`
  margin-bottom: 20px;
`

const ListContainer = ({ items, pagination, search }: PropType) => {
  const [_items, setItems] = useState<Array<BoardConfigType> | undefined>(items)
  const [isCheckAll, setCheckAll] = useState<boolean>(false)
  const alertDialog = useAlertDialog()
  const confirmDialog = useConfirmDialog()

  const onToggle = useCallback((bid?: string, mode?: 'check' | 'uncheck') => {
    setItems((prevItems) => {
      if (mode) {
        setCheckAll(mode === 'check')
        return prevItems?.map((item) => ({ ...item, chk: mode === 'check' }))
      }

      const items = prevItems?.map((item) =>
        item.bid === bid ? { ...item, chk: !Boolean(item.chk) } : item,
      )

      const total = items
        ?.map<number>(({ chk }) => (chk ? 1 : 0))
        .reduce((a, b) => a + b, 0)

      if (items) setCheckAll(total === items.length)

      return items
    })
  }, [])

  const onRemove = useCallback(() => {
    const checked = _items?.filter(({ chk }) => chk) ?? []

    if (checked.length === 0) {
      alertDialog({ text: '삭제할 게시판을 선택하세요.' })
      return
    }

    confirmDialog({
      text: '정말 삭제하겠습니까?',
      confirmCallback: async () => {
        try {
          await Promise.all(
            checked.map(async (board) => {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/board/delete`,
                {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ bid: board.bid, name: board.name }),
                },
              )

              const result = await res.json()
              if (!res.ok || !result.success) {
                throw new Error(result.message || `삭제 실패: ${board.bid}`)
              }

              if (res.ok) {
                alertDialog.success('선택한 게시판이 삭제되었습니다.')
              }
            }),
          )

          setItems((prev) =>
            prev?.filter((item) => !checked.some((c) => c.bid === item.bid)),
          )
        } catch (err) {
          console.error(err)
          alertDialog({ text: '삭제 중 오류가 발생했습니다.' })
        }
      },
    })
  }, [_items, alertDialog, confirmDialog])

  return (
    <>
      <SearchWrapper>
        <BoardSearchForm search={search} />
      </SearchWrapper>
      <BoardItems
        items={_items}
        onToggle={onToggle}
        isCheckAll={isCheckAll}
        onRemove={onRemove}
      />
      <Pagination pagination={pagination} />
    </>
  )
}

export default React.memo(ListContainer)
