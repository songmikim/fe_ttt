import { get } from '../../_services/BoardData'
import UpdateContainer from '../../_containers/UpdateContainer'
import ContentBox from '@/app/_global/components/ContentBox'
import { MainTitle } from '@/app/_global/components/TitleBox'

export default async function UpdatePage({
  params,
}: {
  params: Promise<{ seq: number }>
}) {
  const { seq } = await params
  const data = await get(seq)
  const { board } = data

  return (
    <ContentBox>
      <MainTitle border="true">{data?.subject}</MainTitle>
      <UpdateContainer board={board} data={data} />
    </ContentBox>
  )
}