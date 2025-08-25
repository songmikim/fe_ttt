'use client'
import React from 'react'
import type { BoardConfigType } from '@/app/board/_types/BoardType'
import Pagination from '@/app/_global/components/Pagination'
import BoardItems from '../_components/BoardItems'
import BoardSearchForm from '../_components/BoardSearchForm'

type PropType = {
  items?: Array<BoardConfigType>
  pagination?: any
}

const ListContainer = ({ items, pagination }: PropType) => {
  return (
    <>
      <BoardSearchForm />
      <BoardItems items={items} />
      <Pagination pagination={pagination} />
    </>
  )
}

export default React.memo(ListContainer)