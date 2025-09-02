import { get } from '../../_services/BoardData'
import UpdateContainer from '../../_containers/UpdateContainer'
import ContentBox from '@/app/_global/components/ContentBox'
import { MainTitle } from '@/app/_global/components/TitleBox'
import { redirect } from 'next/navigation'

export default async function UpdatePage({
  params,
}: {
  params: Promise<{ seq: number ,bid:string}>
}) {
  const { seq, bid } = await params
  const data = await get(seq,bid)
  const { board } = data

  if (data && data.canEdit && data.needAuth ) {

    redirect(`/board/check/${seq}?mode=update`)
  }

  return (
    
    <ContentBox>
      <MainTitle border="true">{data?.subject}</MainTitle>
      <UpdateContainer board={board} data={data} />
    </ContentBox>
  )
}