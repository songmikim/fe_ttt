'use client'

import ContentBox from '@/app/_global/components/ContentBox'
import { MainTitle } from '@/app/_global/components/TitleBox'
import RecycleStats from './_containers/RecycleStats'
import UserOnlyContainer from '../_global/wrappers/UserOnlyContainer'
import MypageContainer from './_containers/MypageContainer'
export default function MyPage() {

  return (
    <UserOnlyContainer>
      <ContentBox width={720}>
        <MainTitle border="true">내 프로필</MainTitle>
        <MypageContainer />
        <RecycleStats />
      </ContentBox>
    </UserOnlyContainer>
  )
}
