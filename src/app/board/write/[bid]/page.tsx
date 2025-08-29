import ContentBox from '@/app/_global/components/ContentBox'
import { MainTitle } from '@/app/_global/components/TitleBox'
import { getBoardConfig } from '../../_services/BoardConfig'
import type { BoardConfigType, BoardDataType } from '../../_types/BoardType'
import UpdateContainer from '../../_containers/UpdateContainer'
import { get } from '../../_services/BoardData'

export default async function WritePage({ params }) {
  const { bid } = await params
  const board: BoardConfigType = await getBoardConfig(bid)
  const data: BoardDataType = await get()
  data.bid = bid

  return (
    <ContentBox>
      <MainTitle border="true">{board.name} 글쓰기</MainTitle>
      <UpdateContainer board={board} data={data} />
    </ContentBox>
  )
}