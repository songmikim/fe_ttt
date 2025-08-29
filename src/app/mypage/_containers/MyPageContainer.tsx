'use client'

import React from 'react'
import useUser from '@/app/_global/hooks/useUser'
import MypageForm from '../_components/MypageForm'

const ProfileContainer = () => {
  const { loggedMember } = useUser()

  if (!loggedMember) {
    return <p>로그인된 회원 정보가 없습니다.</p>
  }

  return (
    <MypageForm
      form={loggedMember}
    />
  )
}

export default React.memo(ProfileContainer)
