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

    /* 비밀번호 보기/숨기기 버튼 스타일 */
  .password-wrapper {
    position: relative;
    display: flex;
    align-items: center;

    button {
      position: absolute;
      right: 10px;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      transition: all 0.2s;

      &:hover {
        background: #f5f5f5; 
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); 
      }
    }
  }

  .password-input {
    width: 100%;
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
      <div className="password-wrapper">
        <Input
          type={showpassword ? 'text' : 'password'}
          name="password"
          placeholder="비밀번호를 입력하세요."
          value={form.password}
          onChange={onChange}
          className='password-input'
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

      <SubmitButton type="submit">로그인</SubmitButton>
      <h4>간편 로그인</h4>
    </StyledForm>
  )
}

export default React.memo(LoginForm)
