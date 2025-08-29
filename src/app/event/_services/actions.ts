'use server'

import { fetchSSR } from '@/app/_global/libs/utils'
import type CommonSearchType from '@/app/_global/types/CommonSearchType'
import type { EventListDataType } from '../_types'

export async function getEvents(
  search: CommonSearchType = {},
): Promise<EventListDataType> {
  try {
    const params = new URLSearchParams()
    if (search.page) params.set('page', String(search.page))
    if (search.sopt) params.set('sopt', search.sopt)
    if (search.skey) params.set('skey', search.skey)
    if (search.sdate) params.set('sDate', search.sdate)
    if (search.edate) params.set('eDate', search.edate)
    if (search.limit) params.set('limit', String(search.limit))

    const query = params.toString()
    const res = await fetchSSR(`/events${query ? `?${query}` : ''}`)
    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.error(err)
  }
  return {
    items: [],
    pagination: {
      pages: [],
      page: 1,
      prevRangePage: 0,
      nextRangePage: 0,
      lastPage: 1,
      baseUrl: '',
    },
  }
}

export async function getEvent(hash: string) {
  try {
    const res = await fetchSSR(`/events/${hash}`)
    if (res.ok) {
      return await res.json()
    }
  } catch (err) {
    console.error(err)
  }
  return null
}