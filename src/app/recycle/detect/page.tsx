import DetectContainer from '../containers/DetectContainer'
import ContentBox from '@/app/_global/components/ContentBox'
import { MainTitle } from '@/app/_global/components/TitleBox'

export default function DetectPage() {
  return (
    <ContentBox width={640}>
      <MainTitle center="true">분리수거 감지</MainTitle>
      <DetectContainer />
    </ContentBox>
  )
}
