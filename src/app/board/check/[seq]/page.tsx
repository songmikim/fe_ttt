import { get } from '../../_services/BoardData'
import ContentBox from '@/app/_global/components/ContentBox'
import { MainTitle } from '@/app/_global/components/TitleBox'
import PasswordContainer from '../../_containers/PasswordContainer'

export default async function CheckPage({
  params,
}: {
  params: Promise<{ seq: number }>
}) {
  const { seq } = await params
  const data = await get(seq)

  return (
    <ContentBox>
      <MainTitle border="true">{data?.subject}</MainTitle>
      <PasswordContainer seq={data?.seq} bid={data?.bid} />
    </ContentBox>
  )
}