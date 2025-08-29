import ContentBox from '@/app/_global/components/ContentBox'
import { MainTitle } from '@/app/_global/components/TitleBox'
import { getView, getList } from '../../_services/BoardData'
import ViewContainer from '../../_containers/ViewContainer'
import ListContainer from '../../_containers/ListContainer'
import type { BoardDataType, BoardSearchType } from '../../_types/BoardType'
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

  let items: Array<BoardDataType> = [],
    pagination: any = null

  if (board?.showViewList) {
    const _data = await getList(board.bid, search)
    items = _data.items ?? []
    pagination = _data.pagination
  }
  return (
    <ContentBox>
      {board?.name && <MainTitle border="true">{board.name}</MainTitle>}
      <ViewContainer board={board} data={data} />
      {board?.listable && board?.showViewList && (
        <ListContainer
          board={board}
          items={items}
          pagination={pagination}
          search={search}
        />
      )}
    </ContentBox>
  )
}