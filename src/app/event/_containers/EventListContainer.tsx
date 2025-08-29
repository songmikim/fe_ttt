'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import EventList from '../_components/EventList'
import type { EventType, PaginationType } from '../_types'
import type CommonSearchType from '@/app/_global/types/CommonSearchType'

type Props = {
  events: EventType[]
  pagination: PaginationType
  search?: CommonSearchType
}

const EventListContainer = ({ events, pagination, search }: Props) => {
  const [query, setQuery] = useState(search?.skey ?? '')
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (query) params.set('skey', query)
    params.set('page', '1')
    router.push(`/event?${params.toString()}`)
  }

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams()
    if (query) params.set('skey', query)
    params.set('page', String(p))
    router.push(`/event?${params.toString()}`)
  }

  return (
    <EventList
      query={query}
      onChange={handleChange}
      onSearch={handleSearch}
      events={events}
      pagination={pagination}
      onPageChange={handlePageChange}
    />
  )
}

export default React.memo(EventListContainer)