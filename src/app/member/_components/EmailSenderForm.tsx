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

type VerifyInfo = {
  verifyCode: (form: { email: string; code: string }) => void | Promise<void>
  verState: 'idle' | 'loading' | 'success' | 'error'
}

type AutoSendOptions = {
  isAutoSend: boolean
  targetEmail: string
}

type EmailSenderFormProps = {
  mappingValue: '/member/find-pw' | '/auth/send-code'
  verifyInfo?: VerifyInfo
  autoSendOpt?: AutoSendOptions
}

const EmailSenderForm = ({
  mappingValue,
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

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault()
      setError(undefined)

      if (!email.trim()) {
        setError('이메일을 입력하세요.')
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError('올바른 이메일 형식이 아닙니다.')
        return
      }
      if (email != targetEmail) {
        setError('등록된 이메일 정보와 일치하지 않습니다.')
        return
      }

      setLoading(true)
      setSendState('loading')

      const bodyData =
        mappingValue == '/member/find-pw'
          ? JSON.stringify({ email })
          : JSON.stringify({
              email,
              type: 'WITHDRAWAL_VERIFICATION',
            })

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
        mappingValue == '/member/find-pw'
          ? alertDialog.success('임시 비밀번호가 이메일로 발송되었습니다.')
          : alertDialog.success('탈퇴 인증 번호가 이메일로 발송되었습니다.')
      } else {
        const data = await res.json()
        mappingValue == '/member/find-pw'
          ? setError(data.message ?? '비밀번호 찾기 요청에 실패했습니다.')
          : setError(data.message ?? '탈퇴 인증 번호 전송 요청에 실패했습니다.')
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
    <form onSubmit={handleSubmit}>
      {!isAutoSend && (
        <>
          <Input
            type="text"
            name="email"
            placeholder="이메일을 입력하세요."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <MessageBox color="danger">{error ?? ''}</MessageBox>

          <SubmitButton type="submit" disabled={loading}>
            {loading
              ? '전송 중...'
              : mappingValue === '/member/find-pw'
              ? '임시 비밀번호 발급 받기'
              : '탈퇴 인증 번호 발급 받기'}
          </SubmitButton>
        </>
      )}

      {sendState == 'loading' && (
        <>
          <ClipLoader
            color={'#ff91edff'}
            loading={loading}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </>
      )}

      {isAutoSend && sendState != 'loading' && (
        <>
          <Input
            type="text"
            name="code"
            placeholder="코드를 입력하세요"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <MessageBox color="danger">{error ?? ''}</MessageBox>

          <Button
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
        </>
      )}
    </form>
  )
}

export default React.memo(EmailSenderForm)
