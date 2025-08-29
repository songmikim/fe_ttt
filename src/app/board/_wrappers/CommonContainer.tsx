'use client'
import React, { useEffect, useState } from 'react'
import type { BoardConfigType, BoardDataType } from '../_types/BoardType'
import PasswordContainer from '../_containers/PasswordContainer'

const CommonContainer = ({
  children,
  board,
  data,
  mode,
}: {
  children: React.ReactNode
  board?: BoardConfigType
  data?: BoardDataType
  mode: string
}) => {
  const [isError, setError] = useState<boolean>(false)
  const [isRequiredPassword, setRequiredPassword] = useState(() => data?.needAuth || false) // 비회원 비밀번호 확인이 필요한가?

  return isRequiredPassword ? (
      <PasswordContainer mode={mode} seq={data?.seq} />
    ) : (
      children
    )

}

export default React.memo(CommonContainer)