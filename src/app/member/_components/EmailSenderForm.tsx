'use client'

import React, { useState, useCallback, useEffect, useRef } from 'react'
import { Input } from '@/app/_global/components/Forms'
import { SubmitButton } from '@/app/_global/components/Buttons'
import MessageBox from '@/app/_global/components/MessageBox'
import useAlertDialog from '@/app/_global/hooks/useAlertDialog'
import { Button } from '@/app/_global/components/Buttons'
import Image from 'next/image'
import { ClipLoader } from 'react-spinners'
import styled from 'styled-components'
import { EmailCategory } from '../constants/EmailCategory'
import ContentBox from '@/app/_global/components/ContentBox'
import { MainTitle } from '@/app/_global/components/TitleBox'

const FormWrapper = styled.div`
  .form-inner {
    margin-bottom: 20px;
  }

  .button-wrapper {
    text-align: right;
  }

  .loading-wrapper {
    text-align: center;
  }
`

type VerifyInfo = {
  verifyCode: (form: { email: string; code: string }) => void | Promise<void>
  verState: 'idle' | 'loading' | 'success' | 'error'
}

type AutoSendOptions = {
  isAutoSend: boolean
  targetEmail: string
}

type EmailSenderFormProps = {
  category: EmailCategory
  verifyInfo?: VerifyInfo
  autoSendOpt?: AutoSendOptions
}

const EmailSenderForm = ({
  category,
  verifyInfo,
  autoSendOpt,
}: EmailSenderFormProps) => {
  const { verifyCode, verState } = verifyInfo ?? {}
  const { isAutoSend, targetEmail } = autoSendOpt ?? {}

  const alertDialog = useAlertDialog()
  const [email, setEmail] = useState(targetEmail ?? '')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [sendState, setSendState] = useState<'idle' | 'loading' | 'sent'>(
    'idle',
  )
  const sentRef = useRef(false) // 메일 자동 전송 시, 1번만 보내기 위해 세팅

  console.log(category)

  const mappingValue =
    category === EmailCategory.FIND_PASSWORD
      ? '/member/find-pw'
      : '/auth/send-code'

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault()
      setError(undefined)

      // 이메일 입력 칸이 있을 때만 검증
      if (!isAutoSend) {
        if (!email.trim()) {
          setError('이메일을 입력하세요.')
          return
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
          setError('올바른 이메일 형식이 아닙니다.')
          return
        }
      }

      // 로그인 상태에서 접근 가능한 기능일 때만 검증
      if (targetEmail && category !== EmailCategory.FIND_PASSWORD) {
        if (email != targetEmail) {
          setError('등록된 이메일 정보와 일치하지 않습니다.')
          return
        }
      }

      setLoading(true)
      setSendState('loading')

      const bodyData =
        category === EmailCategory.FIND_PASSWORD
          ? JSON.stringify({
              email,
              type: 'PASSWORD_FINDING',
            })
          : category === EmailCategory.WITHDRAW
          ? JSON.stringify({
              email,
              type: 'WITHDRAWAL_VERIFICATION',
            })
          : category === EmailCategory.RECOVER_ACCOUNT
          ? JSON.stringify({
              email,
              type: 'ACCOUNT_RECOVERY',
            })
          : ''

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${mappingValue}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },

          body: bodyData,
        },
      )

      setLoading(false)
      setSendState('sent')

      if (res.ok) {
        category === EmailCategory.FIND_PASSWORD
          ? alertDialog.success('임시 비밀번호가 이메일로 발송되었습니다.')
          : alertDialog.success('계정 인증 번호가 이메일로 발송되었습니다.')
      } else {
        const data = await res.json()
        category === EmailCategory.FIND_PASSWORD
          ? setError(data.message ?? '비밀번호 찾기 요청에 실패했습니다.')
          : setError(data.message ?? '계정 인증 번호 전송 요청에 실패했습니다.')
      }
    },
    [email, alertDialog, targetEmail, mappingValue],
  )

  useEffect(() => {
    if (isAutoSend && !sentRef.current) {
      handleSubmit()
      sentRef.current = true
    }
  }, [isAutoSend]) // handleSubmit 넣으면 안 됨.

  return (
    <FormWrapper>
      <ContentBox width={640} onSubmit={handleSubmit}>
        {/* 제목 설정 */}
        {category === EmailCategory.FIND_PASSWORD ? (
          <MainTitle className="form-inner" border="true">
            비밀번호 찾기
          </MainTitle>
        ) : category === EmailCategory.WITHDRAW ? (
          <MainTitle className="form-inner" border="true">
            회원 탈퇴하기
          </MainTitle>
        ) : category === EmailCategory.RECOVER_ACCOUNT ? (
          <MainTitle className="form-inner" border="true">
            계정 복구하기
          </MainTitle>
        ) : (
          ''
        )}

        {!isAutoSend && (
          <>
            <Input
              className="form-inner"
              type="text"
              name="email"
              placeholder="이메일을 입력하세요."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MessageBox color="danger">{error ?? ''}</MessageBox>

            <div className="button-wrapper">
              <Button
                width={200}
                className="form-inner"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? '전송 중...'
                  : mappingValue === '/member/find-pw'
                  ? '임시 비밀번호 발급'
                  : '인증 번호 발급'}
              </Button>
            </div>
          </>
        )}

        {sendState == 'loading' && (
          <div className="loading-wrapper">
            <ClipLoader
              color={'rgba(150, 188, 72, 0.8)'}
              loading={loading}
              size={100}
              aria-label="Loading Spinner"
              data-testid="loader"
              
            />
          </div>
        )}

        {category !== EmailCategory.FIND_PASSWORD && sendState != 'loading' && (
          <>
            <Input
              className="form-inner"
              type="text"
              name="code"
              placeholder="코드를 입력하세요"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <MessageBox color="danger">{error ?? ''}</MessageBox>

            <div className="button-wrapper">
              <Button
                className="form-inner"
                type="button"
                disabled={verState === 'loading' || verState === 'success'}
                onClick={() => verifyCode?.({ email, code })}
              >
                {verState === 'idle'
                  ? '확인'
                  : verState === 'loading'
                  ? '인증 중...'
                  : verState === 'success'
                  ? '인증됨'
                  : verState === 'error'
                  ? '다시 시도'
                  : ''}
              </Button>
            </div>
          </>
        )}
      </ContentBox>
    </FormWrapper>
  )
}

export default React.memo(EmailSenderForm)
