'use client'
import React from 'react'
import type { BoardListType } from '../_types/BoardType'
import BoardList from '../_components/BoardList'
import Pagination from '@/app/_global/components/Pagination'

const ListContainer = ({ board, items, pagination, search }: BoardListType) => {
  return (
    <>
    <BoardList board={board} items={items} search={search} />
    <Pagination pagination={pagination} />
    </>
  )
}

export default React.memo(ListContainer)