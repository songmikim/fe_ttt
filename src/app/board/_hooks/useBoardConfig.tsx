'use client'
import { useEffect, useState } from 'react'
import { fetchSSR } from '@/app/_global/libs/utils'

export default function useBoardConfig(bid?: string) {
  const [data, setData] = useState({
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
    afterWritingRedirect: false,
    showViewList: false,
    listAuthority: 'ALL',
    viewAuthority: 'ALL',
    writeAuthority: 'ALL',
    commentAuthority: 'ALL',
  })
  useEffect(() => {
    if (!bid) return
    ;(async () => {
      const res = await fetchSSR(`admin/board/update/{bid}`)
      if (res.status !== 200) {
        return
      }

      const data = await res.json()
      data.mode = 'update'

      setData(data)
    })()
  }, [bid])

  return data
}