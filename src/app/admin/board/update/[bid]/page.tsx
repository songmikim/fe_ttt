import UpdateContainer from '../../_containers/UpdateContainer'
import { getBoardConfig } from '@/app/board/_services/BoardConfig'
import type { BoardConfigType } from '@/app/board/_types/BoardType'
import { MainTitle } from '@/app/_global/components/TitleBox'
import AdminOnlyContainer from '@/app/_global/wrappers/AdminOnlyContainer'
import { notFound } from 'next/navigation'

export default async function BoardUpdatePage({ params }) {
  const { bid } = await params
  const data: BoardConfigType = await getBoardConfig(bid)
  if (!data.bid) {
    notFound()
  }
  return (
    <AdminOnlyContainer>
      <MainTitle border="true">게시판 설정 수정</MainTitle>
      <UpdateContainer data={data} />
    </AdminOnlyContainer>
  )
}