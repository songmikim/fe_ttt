import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import {
  MdCheckBox,
  MdCheckBoxOutlineBlank,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from 'react-icons/md'
import { Input } from '@/app/_global/components/Forms'
import { Button, SubmitButton } from '@/app/_global/components/Buttons'
import MessageBox from '@/app/_global/components/MessageBox'
import FileUpload from '@/app/_global/components/FileUpload'
import FileImages from '@/app/_global/components/FileImages'
import color from '@/app/_global/styles/color'
import { passwordStrengthLevel } from '@/app/_global/libs/commons'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const StyledForm = styled.form`
  .message {
    margin-bottom: 10px;
  }

  /* 비밀번호 보기/숨기기 버튼 & 메일/확인 버튼 스타일 */
  .password-wrapper {
    position: relative;
    margin-bottom: 10px;

    input {
      width: 100%;
    }

    button {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
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
  /* 이메일 전송/인증 버튼 스타일 */
  .email-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;

    input {
      flex: 1;
    }

    button {
      background: #fff; /* 비밀번호 버튼 스타일 재사용 */
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 4px 12px;
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

      &:disabled {
        cursor: not-allowed;
        opacity: 0.6;
        box-shadow: none;
      }
    }
  }

  .profile-images img {
    width: 150px;
    height: 150px;
    object-fit: cover;
  }
`
const TermsAgree = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 14px;
`

const TermsBox = styled.div`
  margin: 0 0 15px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
  font-size: 14px;
  line-height: 1.5;
`

const PasswordWrapper = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  width: 100%;
`

const passwordColor = (level1: number) => {
  if (level1 <= 2) return color.danger // 위험
  if (level1 <= 4) return color.warning // 경고
  if (level1 <= 6) return color.success // 중요한
  return color.success
}

const getPasswordMessage = (level: number) => {
  if (level === 0) return ''
  if (level <= 2) return '위험'
  if (level <= 4) return '보통'
  return '안전'
}

// 비밀번호 강도에 따라 색상 지정
const PasswordStrength = styled.ul<{ level: number }>`
  display: flex;
  height: 15px;
  width: 50%;
  margin-top: 3px;
  margin-bottom: 10px;

  li {
    width: calc(100% / 6 - 2px);
    margin-right: 2px;
    transition: background 0.3s;
    background: #ccc;
    border-radius: 10px;

    &.active {
      background: ${({ level }) => passwordColor(level)};
    }
  }

  li:last-child {
    margin-right: 0;
  }
`

const JoinForm = ({
  errors,
  action,
  pending,
  onChange,
  onToggle,
  form,
  fileUploadCallback,
  fileDeleteCallback,
  sendCode,
  verifyCode,
  verified,
  sendState,
}) => {
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [showconfirmPassword, setShowConfirmPassword] = useState(false)
  const [showTerms, setShowTerms] = useState(false) // 약관 토글

  // 비밀벊노 복잡성 레벨에 맞게 비밀번호 strength 지정
  useEffect(() => {
    if (form.password) {
      setPasswordStrength(passwordStrengthLevel(form.password))
    } else {
      setPasswordStrength(0)
    }
  }, [form.password])

  // 약관동의 제목 클릭 시 토글
  const handleTermsToggle = () => setShowTerms((prev) => !prev)

  return (
    <StyledForm action={action} autoComplete="off">
      <input type="hidden" name="gid" value={form.gid} />
      <input type="hidden" name="termsAgree" value={form.termsAgree} />

      {form.socialChannel && form.socialToken && (
        <>
          <input
            type="hidden"
            name="socialChannel"
            value={form.socialChannel}
          />

          <input type="hidden" name="socialToken" value={form.socialToken} />
          <div>{form.socialChannel} 계정 연결 회원가입</div>
        </>
      )}

      <div className="email-row">
        <Input
          type="text"
          name="email"
          placeholder="이메일을 입력하세요"
          value={form.email}
          onChange={onChange}
          disabled={verified}
        />
        {verified && <input type="hidden" name="email" value={form.email} />}
        <button
          type="button"
          onClick={sendCode}
          disabled={verified || sendState === 'loading'}
        >
          {verified
            ? '인증완료'
            : sendState === 'loading'
            ? '발송 중...'
            : sendState === 'sent'
            ? '재전송'
            : '메일 발송'}
        </button>
      </div>
      <MessageBox color="danger">{errors?.email}</MessageBox>

      {!verified && (
        <div className="email-row">
          <Input
            type="text"
            name="code"
            placeholder="인증 코드 입력"
            value={form.code || ''}
            onChange={onChange}
          />
          <button type="button" onClick={verifyCode}>
            확인
          </button>
        </div>
      )}

      {(!form?.socialChannel || !form?.socialToken) && (
        <>
          <div className="password-wrapper">
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="비밀번호를 입력하세요."
              value={form.password}
              onChange={onChange}
              minLength={8}
              maxLength={25}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
            </button>
          </div>
          <PasswordWrapper>
            <span
              style={{ fontSize: '14px', color: passwordColor(passwordStrength) }}
            >
              {getPasswordMessage(passwordStrength)}
            </span>
            <PasswordStrength level={passwordStrength}>
              {Array.from({ length: 6 }).map((_, i) => (
                <li
                  key={'password-strength-' + i}
                  className={i < passwordStrength ? 'active' : ''}
                />
              ))}
            </PasswordStrength>
          </PasswordWrapper>
          <MessageBox color="danger">{errors?.password}</MessageBox>
          <div className="password-wrapper">
            <Input
              type={showconfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="비밀번호를 확인하세요."
              value={form.confirmPassword}
              onChange={onChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showPassword ? '비빌 번호 숨기기 ' : '비밀 번호 보기 '
              }
            >
              {showconfirmPassword ? (
                <FaEye size={20} />
              ) : (
                <FaEyeSlash size={20} />
              )}
            </button>
          </div>

          <MessageBox color="danger">{errors?.confirmPassword}</MessageBox>
        </>
      )}
      <Input
        type="text"
        name="name"
        placeholder="회원이름을 입력하세요."
        value={form.name}
        onChange={onChange}
        maxLength={15}
      />
      <MessageBox color="danger">{errors?.name}</MessageBox>

      <Input
        type="text"
        name="mobile"
        placeholder="휴대전화번호를 입력하세요."
        value={form.mobile}
        onChange={onChange}
      />
      <MessageBox color="danger">{errors?.mobile}</MessageBox>

      <h3>프로필 이미지</h3>

      <div className="profile-images">
        <FileImages
          items={form.profileImage}
          callback={fileDeleteCallback}
          viewOrgImage={true}
        />
      </div>
      <FileUpload
        gid={form.gid}
        imageOnly={true}
        single={true}
        callback={fileUploadCallback}
      />

      <h3 style={{ cursor: 'pointer' }} onClick={handleTermsToggle}>
        약관동의 {showTerms ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
      </h3>

      {showTerms && (
        <TermsBox>
          <strong>약관 동의 작성...</strong>
          <p>
            본 서비스 이용을 위해서는 회원가입 약관에 동의해야 합니다.
            개인정보는 회원 관리 및 서비스 제공을 위해 사용됩니다.
          </p>
        </TermsBox>
      )}

      <TermsAgree onClick={onToggle}>
        <span>
          {form.termsAgree ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}{' '}
          회원가입 약관에 동의합니다.
        </span>
      </TermsAgree>

      <MessageBox color="danger">{errors?.termsAgree}</MessageBox>

      <SubmitButton
        type="submit"
        disabled={pending}
        style={{ marginTop: '30px' }}
      >
        가입하기
      </SubmitButton>
      <MessageBox color="danger">{errors?.global}</MessageBox>
    </StyledForm>
  )
}

export default React.memo(JoinForm)
