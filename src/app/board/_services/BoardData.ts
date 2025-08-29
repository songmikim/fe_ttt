'use server'
import type {
  BoardDataType,
  BoardSearchType,
  BoardListType,
} from '../_types/BoardType'
import { v4 as uuid } from 'uuid'
import { fetchSSR } from '@/app/_global/libs/utils'
import { toDate } from 'date-fns'
import { toQueryString } from '@/app/_global/libs/commons'

export async function get(seq?: number): Promise<BoardDataType> {
  let data: BoardDataType = {
    mode: 'write',
    bid: '',
    gid: uuid(),
    category: '',
    poster: '',
    guestPw: '',
    subject: '',
    content: '',
    notice: false,
    secret: false,
    guest: false,
    editorImages: [],
    attachFiles: [],
  }

  if (seq) {

    try{
      // 게시글 조회
      const res = await fetchSSR(`/board/update/${seq}`)

      if (res.status === 200) {
        data = await res.json()
        console.log("대이타",data,data.content)
        data.mode = 'update'
        data.bid = data.board?.bid;

        data.createdAt = toDate(data.createdAt ?? new Date())
        if (data.modifiedAt) data.modifiedAt = toDate(data.modifiedAt)
        if (data.deletedAt) data.deletedAt = toDate(data.deletedAt)
      }
        
        return data
      } catch (error) {
        console.error('데이터 로드 실패', error)
      }
      data.mode = 'update'
    }
  
  return data
  
}

export async function getView(seq?: number): Promise<BoardDataType> {
  let data
  try{
    // 게시글 조회
    const res = await fetchSSR(`/board/view/${seq}`)
    console.log("피카!!!!!!")
    if (res.status === 200) {
      data = await res.json()
      console.log("대이타",data,data.content)
      data.bid = data.board?.bid;

      data.createdAt = toDate(data.createdAt ?? new Date())
      if (data.modifiedAt) data.modifiedAt = toDate(data.modifiedAt)
      if (data.deletedAt) data.deletedAt = toDate(data.deletedAt)
    }
        
      return data
    } catch (error) {
      console.error('데이터 로드 실패', error)
    }
  
return data
 
}


/**
 * 게시판별 목록
 * @param bid
 * @param search
 * @returns
 */
export async function getList(
  bid: string,
  search: BoardSearchType,
): Promise<BoardListType> {
  const qs = toQueryString(search)
  const res = await fetchSSR(`/board/list/${bid}${qs}`)
  console.log("res",res)
  if (res.status === 200) {
    const data = await res.json()
    data.items.forEach((item) => {
      item.createdAt = toDate(item.createdAt)
      if (item.modifiedAt) item.modifiedAt = toDate(item.modifiedAt)
      if (item.deletedAt) item.deletedAt = toDate(item.deletedAt)
    })
    return data
  }

  return {}
}