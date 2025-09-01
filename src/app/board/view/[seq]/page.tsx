import ContentBox from '@/app/_global/components/ContentBox'
import { MainTitle } from '@/app/_global/components/TitleBox'
import { getView, getList } from '../../_services/BoardData'
import ViewContainer from '../../_containers/ViewContainer'
import ListContainer from '../../_containers/ListContainer'
import type { BoardDataType, BoardSearchType } from '../../_types/BoardType'
import CommentContainer from '../../_containers/CommentContainer'
import { getList as getComments } from '../../_services/comment'


export default async function ViewPage({
  params,
  searchParams,
}: {
  params: Promise<{ seq: number }>
  searchParams: Promise<BoardSearchType>
}) {
  const { seq } = await params
  const data = await getView(seq)
  const { board } = data
  data.mode = 'view'

  const search = await searchParams


  const comments = await getComments(seq)

  return (
    <ContentBox>
      {board?.name && <MainTitle border="true">{board.name}</MainTitle>}
      <ViewContainer board={board} data={data} />
      <CommentContainer board={board} data={data} items={comments} />
    </ContentBox>
  )
}