import ContentBox from '@/app/_global/components/ContentBox'
import { MainTitle } from '@/app/_global/components/TitleBox'
import JoinContainer from '../_containers/JoinContainer'

export default function JoinPage() {
  return (
    <ContentBox width={800}>
      <MainTitle border="true">회원가입</MainTitle>
      <JoinContainer />
    </ContentBox>
  )
}
