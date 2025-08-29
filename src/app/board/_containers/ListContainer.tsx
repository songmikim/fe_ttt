'use client'
import React from 'react'
import type { BoardListType } from '../_types/BoardType'
import CommonContainer from '../_wrappers/CommonContainer'
import BoardList from '../_components/BoardList'
import Pagination from '@/app/_global/components/Pagination'

const ListContainer = ({ board, items, pagination, search }: BoardListType) => {
  return (
    <CommonContainer board={board} mode="list">
      <BoardList board={board} items={items} search={search} />
      <Pagination pagination={pagination} />
    </CommonContainer>
  )
}

export default React.memo(ListContainer)