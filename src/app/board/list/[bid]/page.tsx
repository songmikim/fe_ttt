import ContentBox from '@/app/_global/components/ContentBox'
import { MainTitle } from '@/app/_global/components/TitleBox'
import { getBoardConfig } from '../../_services/BoardConfig'
import { getList } from '../../_services/BoardData'
import type {
  BoardConfigType,
  BoardSearchType,
  BoardListType,
} from '../../_types/BoardType'
import ListContainer from '../../_containers/ListContainer'
export default async function ListPage({
  params,
  searchParams,
}: {
  params: Promise<{ bid: string }>
  searchParams: Promise<BoardSearchType>
}) {
  const { bid } = await params
  const board: BoardConfigType = await getBoardConfig(bid)
  const search = await searchParams

  const { items, pagination } = await getList(bid, search)

  return (
    <ContentBox>
      <MainTitle border="true">{board.name}</MainTitle>
      <ListContainer board={board} items={items} pagination={pagination} search={search} />
    </ContentBox>
  )
}