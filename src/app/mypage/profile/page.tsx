import UserOnlyContainer from '@/app/_global/wrappers/UserOnlyContainer'
import ContentBox from '@/app/_global/components/ContentBox'
import { MainTitle } from '@/app/_global/components/TitleBox'
import ProfileContainer from '../_containers/ProfileContainer'

export default function ProfilePage() {
  return (
    <UserOnlyContainer>
      <ContentBox width={720}>
        <MainTitle border="true">프로필 수정</MainTitle>
        <ProfileContainer />
      </ContentBox>
    </UserOnlyContainer>
  )
}
