'use client'
import React, { useContext, useLayoutEffect, useCallback } from 'react'
import type { BoardConfigType, BoardDataType } from '../_types/BoardType'
import CommonContainer from '../_wrappers/CommonContainer'
import BoardView from '../_components/BoardView'
import CommonContext from '@/app/_global/contexts/CommonContext'
import useConfirmDialog from '@/app/_global/hooks/useConfirmDialog'

const ViewContainer = ({
  board,
  data,
}: {
  board?: BoardConfigType
  data?: BoardDataType
}) => {
  const {
    actions: { setMainTitle },
  } = useContext(CommonContext)

  useLayoutEffect(() => {
    if (data && board) {
      setMainTitle(`${data.subject}|${board.name}`)
    }
  }, [data, board, setMainTitle])

  const confirmDialog = useConfirmDialog()

  const onDelete = useCallback((e) => {
    confirmDialog({
      text: '정말 삭제하겠습니까?',
      cancelCallback: () => {
        e.preventDefault()
      },
    })
  }, [confirmDialog])

  return (
    <CommonContainer board={board} data={data} mode="view">
      <BoardView board={board} data={data} />
    </CommonContainer>
  )
}

export default React.memo(ViewContainer)