import ListContainer from './_containers/ListContainer'
import { getBoardList } from '@/app/board/_services/BoardConfig'
import type CommonSearchType from '@/app/_global/types/CommonSearchType'

export default async function BoardListPage({
  searchParams,
}: {
  searchParams: Promise<CommonSearchType>
}) {
  const params = await searchParams
  const { items, pagination } = await getBoardList(params)
  return <ListContainer items={items} pagination={pagination} search={params} />
}