import React, { useState } from 'react'
import styled from 'styled-components'
import { Input } from '@/app/_global/components/Forms'
import { SubmitButton } from '@/app/_global/components/Buttons'
import MessageBox from '@/app/_global/components/MessageBox'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const StyledForm = styled.form`
  h4 {
    font-size: 16px;
    font-weight: 400;
    margin: 80px 0 20px;
    padding-top: 15px;

    border-top: 1px solid #ddd;
    color: #777;
    text-align: center;
  }
`
const LoginButton = styled(SubmitButton)`
  width: 800px;
  margin: 10px auto;
  display: block;
  //margin-bottom: 4px;
  background-color: #ffffff;
  color: #333333;
  border: 2.4px solid #333333;
  font-size: 18px;
  font-weight: bold;
  padding: 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #4caf50;
    color: #4caf50;
  }

  &:disabled {
    background-color: #e0e0e0;
    color: #888;
    cursor: not-allowed;
  }
`

const LoginForm = ({ errors, action, pending, form, onChange }) => {
  const [showpassword, setShowPasword] = useState(false)
  return (
    <StyledForm action={action} autoComplete="off">
      <input type="hidden" name="redirectUrl" value={form.redirectUrl ?? ''} />
      <Input
        type="text"
        name="email"
        placeholder="이메일을 입력하세요."
        value={form.email}
        onChange={onChange}
      />
      <MessageBox color="danger">{errors?.email}</MessageBox>
      <div>
        <Input
          type={showpassword ? 'text' : 'password'}
          name="password"
          placeholder="비밀번호를 입력하세요."
          value={form.password}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={() => setShowPasword((prve) => !prve)}
          aria-label={showpassword ? '비밀 번호 숨기기' : '비밀 번호 보기 '}
        >
          {showpassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
        </button>
      </div>
      <MessageBox color="danger">{errors?.password}</MessageBox>

      <a
        href="/member/find-password"
        style={{ display: 'block', margin: '10px 0' }}
      >
        비밀번호 찾기
      </a>

      <MessageBox color="danger">{errors?.global}</MessageBox>

      <LoginButton type="submit">로그인</LoginButton>
      <h4>간편 로그인</h4>
    </StyledForm>
  )
}

export default React.memo(LoginForm)
