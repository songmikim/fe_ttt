import { get } from '../../_services/BoardData'
import ContentBox from '@/app/_global/components/ContentBox'
import { MainTitle } from '@/app/_global/components/TitleBox'
import PasswordContainer from '../../_containers/PasswordContainer'
import { redirect } from 'next/navigation'

export default async function CheckPage({
  params,
}: {
  params: Promise<{ seq: number, bid:string }>
}) {
  const { seq } = await params
  const { bid } = await params
  const data = await get(seq, bid)

  return (
    <ContentBox>
      <MainTitle border="true">{data?.subject}</MainTitle>
      <PasswordContainer seq={seq} bid={data?.bid} />
    </ContentBox>
  )
}