import React from 'react'
import type { BoardListType } from '@/app/board/_types/BoardType'
import BoardListItems from './BoardListItems'
import BoardSearchForm from './BoardSearchForm'
import BoardCategory from './BoardCategory'
const BoardList = ({ board, items, search }: BoardListType) => {
  return (
    <>
      <BoardCategory board={board} />
      <BoardListItems items={items} />
      <BoardSearchForm search={search} board={board} />
    </>
  )
}

export default React.memo(BoardList)





