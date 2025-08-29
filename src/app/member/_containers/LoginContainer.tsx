'use client'
import Image from 'next/image'
import React, {
  useActionState,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react'
import styled from 'styled-components'
import color from '@/app/_global/styles/color'
import { useSearchParams } from 'next/navigation'
import { processLogin } from '../_services/actions'
import LoginForm from '../_components/LoginForm'
import KakaoApi from '../social/_service/KakaoApi'
import NaverApi from '../social/_service/NaverApi'
import kakaoLoginButton from '../../_global/assets/images/kakao_login.png'
import naverLoginButton from '../../_global/assets/images/naver_login.png'

type FormType = {
  email: string
  password: string
  redirectUrl?: string
}

const { naverGreen } = color

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 4px;
`

const NaverButton = styled.a`
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 이미지를 위로 붙임 */
  background-color: ${naverGreen}; /* 네이버 초록색 */
  width: 400px;
  height: 60px;
  border-radius: 8px;
`

const kakaoApi = new KakaoApi()
const naverApi = new NaverApi()
const LoginContainer = ({
  redirectUrl,
  errors: initialErrors = {},
}: {
  redirectUrl?: string
  errors?: any
}) => {
  const [errors, action, pending] = useActionState<any, any>(
    processLogin,
    initialErrors,
  )
  const [form, setForm] = useState<FormType>({
    email: '',
    password: '',
    redirectUrl: redirectUrl ?? '',
  })

  const searchParams = useSearchParams()

  const kakaoLoginUrl = useMemo(
    () => kakaoApi.getUrl(form.redirectUrl),
    [form.redirectUrl],
  )

  const naverLoginUrl = useMemo(
    () => naverApi.getUrl(form.redirectUrl),
    [form.redirectUrl],
  )

  useEffect(() => {
    const redirectUrl = searchParams.get('redirectUrl')?.toString()
    if (!redirectUrl) return

    setForm((prev) => ({ ...prev, redirectUrl }))
  }, [searchParams])

  const onChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  return (
    <>
      <LoginForm
        errors={errors}
        action={action}
        pending={pending}
        form={form}
        onChange={onChange}
      />
      <ButtonGroup>
        <a href={kakaoLoginUrl}>
          <Image
            src={kakaoLoginButton}
            alt="카카오 로그인"
            width={400}
            height={60}
          />
        </a>
        <NaverButton href={naverLoginUrl}>
          <Image
            src={naverLoginButton}
            alt="네이버 로그인"
            width={400}
            height={60}
          />
        </NaverButton>
      </ButtonGroup>
    </>
  )
}

export default React.memo(LoginContainer)
