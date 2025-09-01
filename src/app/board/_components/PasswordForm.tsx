'use client'
import React from 'react'
import styled from 'styled-components'
import { Input } from '@/app/_global/components/Forms'
import MessageBox from '@/app/_global/components/MessageBox'
import Loading from '@/app/_global/components/Loading'
const StyledForm = styled.form``

const PasswordForm = ({
  bid,
  mode,
  seq,
  errors,
  action,
  pending,
  password,
  onChange,
}) => {
  return (
    <StyledForm action={action} autoComplete="off">
      <h1>비회원 비밀번호 확인</h1>
      <input type="hidden" name="mode" defaultValue={mode} />
      <input type="hidden" name="seq" defaultValue={seq} />
      <input type="hidden" name="bid" defaultValue={bid} />
      <MessageBox color="danger">{errors?.mode}</MessageBox>
      <MessageBox color="danger">{errors?.seq}</MessageBox>
      <MessageBox color="danger">{errors?.global}</MessageBox>

      <Input
        type="password"
        name="password"
        placeholder="비밀번호"
        value={password}
        onChange={onChange}
      />
      <MessageBox color="danger">{errors?.password}</MessageBox>

      <button type="submit" disabled={pending}>
        확인 <Loading loading={pending} />
      </button>
    </StyledForm>
  )
}

export default React.memo(PasswordForm)