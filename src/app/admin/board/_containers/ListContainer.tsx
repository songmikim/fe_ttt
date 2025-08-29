'use client'
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
        .reduce((a, b) => a + b)

      if (items) setCheckAll(total === items.length)

      return items
    })
  }, [])

  const onRemove = useCallback(() => {
    /**
     * 1. 삭제할 게시판을 선택했는지 체크
     * 2. 정말 삭제할것인지 물어보고 진행
     */

    const isCheckedAny = _items ? _items.some(({ chk }) => Boolean(chk)) : false
    if (!isCheckedAny) {
      alertDialog({ text: '삭제할 게시판을 선택하세요.' })
      return
    }

    confirmDialog({
      text: '정말 삭제하겠습니까?',
      confirmCallback: () => {
        // 실제 삭제 처리 로직...
      },
    })
  }, [_items, alertDialog, confirmDialog])

  return (
    <>
      <BoardSearchForm search={search} />
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