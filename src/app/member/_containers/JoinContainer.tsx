'use client'
import React, { useActionState, useState, useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import { useSearchParams } from 'next/navigation'
import { processJoin } from '../_services/actions'
import JoinForm from '../_components/JoinForm'
import useAlertDialog from '@/app/_global/hooks/useAlertDialog'
import { passwordStrengthLevel } from '@/app/_global/libs/commons'

type FormType = {
  gid: string
  email: string
  password: string
  confirmPassword: string
  name: string
  mobile: string
  termsAgree: boolean
  socialChannel?: string
  socialToken?: string | number
  profileImage?: any
  code?: string
  sendState?: string
  passwordStrength?: number
}

const JoinContainer = () => {
  const searchParams = useSearchParams()
  const alertDialog = useAlertDialog()

  const [errors, setErrors] = useState<any>({})
  const [formErrors, action, pending] = useActionState<any, any>(
    processJoin,
    {},
  )
  const [form, setForm] = useState<FormType>({
    gid: uuid(),
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    mobile: '',
    termsAgree: false,
    socialChannel: searchParams.get('channel')?.toString(),
    socialToken: searchParams.get('token')?.toString(),
  })

  const [verified, setVerified] = useState(false)
  const [sendState, setSendState] = useState<'idle' | 'loading' | 'sent'>(
    'idle',
  )
  const onChange = useCallback((e) => {
    setForm((prev) => {
      const data = { ...prev, [e.target.name]: e.target.value }
      if (e.target.name === 'password') {
        data.passwordStrength = passwordStrengthLevel(e.target.value)
      }
      return data
    })
  }, [])

  const onToggle = useCallback(() => {
    setForm((prev) => ({ ...prev, termsAgree: !prev.termsAgree }))
  }, [])

  // 이메일 인증 코드 요청
  const sendCode = useCallback(async () => {
    const newErrors: any = {}

    if (!form.email || !form.email.trim()) {
      newErrors.email = '이메일을 입력하세요.'
      setErrors(newErrors)
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.'
      setErrors(newErrors)
      return
    }

    // 검증 통과했으면 기존 에러 제거
    setErrors((prev: any) => {
      const copy = { ...prev }
      delete copy.email
      return copy
    })

    setSendState('loading')

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/send-code`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          type: 'SIGN_UP_VERIFICATION',
        }),
      },
    )
    if (res.ok) {
      alertDialog.success('인증 코드가 이메일로 발송되었습니다.', () =>
        setSendState('sent'),
      )
    } else {
      const data = await res.json()

      // 백엔드에서 내려온 에러 메시지를 errors에 세팅
      setErrors((prev: any) => ({ ...prev, ...data.messages }))
      setSendState('idle')
    }
  }, [form.email, alertDialog])

  // 이메일 코드 검증
  const verifyCode = useCallback(async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-code`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          email: form.email,
          code: form.code || '',
        }),
      },
    )
    if (res.ok) {
      alertDialog.success('이메일 인증 완료!', () => setVerified(true))
    } else {
      alertDialog.error('코드 인증 실패')
    }
  }, [form.email, form.code, alertDialog])

  // 프로필 이미지 업로드 후 후속 처리
  const fileUploadCallback = useCallback((items) => {
    if (items && items.length > 0) {
      setForm((prev) => ({ ...prev, profileImage: items[0] }))
    }
  }, [])

  // 프로필 이미지 삭제 후 후속 처리
  const fileDeleteCallback = useCallback(() => {
    setForm((prev) => {
      const form = { ...prev }
      delete form.profileImage
      return form
    })
  }, [])

  return (
    <JoinForm
      errors={{ ...formErrors, ...errors }}
      action={action}
      pending={pending}
      onChange={onChange}
      onToggle={onToggle}
      fileUploadCallback={fileUploadCallback}
      fileDeleteCallback={fileDeleteCallback}
      form={form}
      sendCode={sendCode}
      verifyCode={verifyCode}
      verified={verified}
      sendState={sendState}
    />
  )
}

export default React.memo(JoinContainer)
