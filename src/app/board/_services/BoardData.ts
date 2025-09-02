'use server'
import type {
  BoardDataType,
  BoardSearchType,
  BoardListType,
} from '../_types/BoardType'
import { fetchSSR } from '@/app/_global/libs/utils'
import { toDate } from 'date-fns'
import { toQueryString } from '@/app/_global/libs/commons'
import { notFound } from 'next/navigation'

export async function get(seq?: number, bid?: string): Promise<BoardDataType> {
   
  let apiUrl=`/board/write/${bid}`
  if (seq) {
    apiUrl=`/board/update/${seq}`
  }

  try{
      // 게시글 조회
    const res = await fetchSSR(apiUrl)
    console.log(res)

    if (res.status === 404) {
      notFound() // Next.js 404 페이지
    }

    if (res.status === 403) {
      throw new Error('권한없음')
    }

    if (res.status !== 200) {
      throw new Error(`예상치 못한 응답 상태: ${res.status}`)
    }

    // 200인 경우에만 여기 도달
    
    const data = await res.json()
    data.bid = data.board?.bid
    data.createdAt = toDate(data.createdAt ?? new Date())
    if (data.modifiedAt) data.modifiedAt = toDate(data.modifiedAt)
    if (data.deletedAt) data.deletedAt = toDate(data.deletedAt)
    if (seq) data.mode = 'update'
    delete data.guestPw;

    return data
        
    } catch (error) {
      console.error('데이터 로드 실패', error)
      throw Error
    }

}

export async function getView(seq?: number): Promise<BoardDataType> {
  let data
  try{
    // 게시글 조회
    const res = await fetchSSR(`/board/view/${seq}`)
    if (res.status === 200) {
      data = await res.json()
      data.bid = data.board?.bid;

      data.createdAt = toDate(data.createdAt ?? new Date())
      if (data.modifiedAt) data.modifiedAt = toDate(data.modifiedAt)
      if (data.deletedAt) data.deletedAt = toDate(data.deletedAt)
      delete data.guestPw;
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