'use client'

import React, { useState, useCallback } from 'react'
import useAlertDialog from '@/app/_global/hooks/useAlertDialog'
import EmailSenderForm from '../../_components/EmailSenderForm'
import useFetchCSR from '@/app/_global/hooks/useFetchCSR'
import { EmailCategory } from '../../constants/EmailCategory'

const WithdrawContainer = ({ loggedEmail }) => {
  const alertDialog = useAlertDialog()
  const { fetchCSR, ready } = useFetchCSR()
  const [error, setError] = useState<string | null>(null)

  const [verState, setVerState] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')

  // 이메일 코드 검증
  const verifyCode = useCallback(
    async ({ email, code }: { email: string; code: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-code`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            email: email,
            code: code || '',
          }),
        },
      )
      if (res.ok) {
        setVerState('success')
        try {
          if (!ready) return

          const res = await fetchCSR(`/member/withdraw`, { method: 'POST' })
          const data = await res.json()

          // 성공 메시지 확인 후 로그아웃 페이지로 리다이렉트
          if (res.ok) {
            alertDialog.success(
              data.message ?? '탈퇴 처리가 완료되었습니다.',
              () => {
                window.location.href = '/member/api/logout'
              },
            )
          } else {
            alertDialog.error(data.message ?? '탈퇴 처리에 실패했습니다.')
          }
        } catch (err: any) {
          setError(err.message)
          setVerState('error')
        }
      } else {
        alertDialog.error('코드 인증 실패')
      }
    },
    [alertDialog, ready], // fetchCSR 넣으면 안 됨.
  )

  return (
    <EmailSenderForm
      category={EmailCategory.WITHDRAW}
      autoSendOpt={{
        isAutoSend: true,
        targetEmail: loggedEmail,
      }}
      verifyInfo={{
        verifyCode: verifyCode,
        verState: verState,
      }}
    />
  )
}

export default React.memo(WithdrawContainer)
