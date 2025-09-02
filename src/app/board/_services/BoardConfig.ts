import type { BoardConfigType } from '../_types/BoardType'
import type CommonSearchType from '@/app/_global/types/CommonSearchType'
import { fetchSSR } from '@/app/_global/libs/utils'
import { toQueryString } from '@/app/_global/libs/commons'
import { _adjustLastTableColumnIndex } from 'ckeditor5'

export const defaultData: BoardConfigType = {
  mode: 'register',
  bid: '',
  name: '',
  rowsForPage: 20,
  pageCount: 10,
  skin: 'default',
  category: '',
  active: false,
  editor: false,
  imageUpload: false,
  attachFile: false,
  comment: false,
  listAuthority: 'ALL',
  viewAuthority: 'ALL',
  writeAuthority: 'ALL',
  commentAuthority: 'ALL',
}

export async function getBoardConfig(bid?: string): Promise<BoardConfigType> {
  'use server'
  if (bid) {
    const res = await fetchSSR(`/admin/board/update/${bid}`)
    if (res.status === 200) {
      const _data = await res.json()
      _data.mode = 'update'
      console.log("체",_data)
      return _data
    }
  }

  return defaultData
}

/**
 * 게시판 목록 조회
 *
 * @param searchParams
 */
export async function getBoardList(searchParams: CommonSearchType): Promise<{
  items?: Array<BoardConfigType>
  pagination?: any
}> {
  'use server'
  const qs = await toQueryString(searchParams)
  const res = await fetchSSR(`/admin/board/list${qs}`)
  console.log(res)
  if (res.status === 200) {
    return await res.json()
  }
  return {}
}