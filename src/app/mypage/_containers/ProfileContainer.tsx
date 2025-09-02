'use client'
import React, {
  useActionState,
  useCallback,
  useState,
  useEffect,
  useContext,
} from 'react'
import ProfileForm from '../_components/ProfileForm'
import useUser from '@/app/_global/hooks/useUser'
import { processProfile } from '../_services/actions'
import UserContext from '@/app/_global/contexts/UserContext'
import LayerPopup from '@/app/_global/components/LayerPopup'
import { Button } from '@/app/_global/components/Buttons'
import useAlertDialog from '@/app/_global/hooks/useAlertDialog'
import { redirect } from 'next/navigation'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import styled from 'styled-components'


const PwModalContent = styled.div`
  .password-wrapper {
    position: relative;

    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 8px;
      font-size: 14px;
    }

    button {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: transparent;
      border: none;
      cursor: pointer;
      color: #666;

      &:hover {
        color: #333;
      }
    }
  }

  p {
    margin-top: 8px;
    color: #d9534f;
    font-size: 13px;
  }

  .button-group {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }
`


const ProfileContainer = () => {
  const [showPw, setShowPw] = useState(false)
  const { loggedMember } = useUser()
  const [form, setForm] = useState(loggedMember)
  const [errors, action, pending] = useActionState<any, any>(processProfile, {})
  const {
    actions: { setLoggedMember },
  } = useContext(UserContext)

  const isSocialUser = loggedMember?.socialChannel

  const [pwModalOpen, setPwModalOpen] = useState(!isSocialUser) // 페이지 접속 시 모달
  const [pwAuthenticated, setPwAuthenticated] = useState(isSocialUser) // 인증 성공 여부

  const [password, setPassword] = useState('')
  const [pwError, setPwError] = useState('')
  const alertDialog = useAlertDialog()

  useEffect(() => {
    // 회원 정보 수정이 완료 된 경우, 회원정보 업데이트
    if (errors?.status === 'DONE') {
      alertDialog.success('회원 정보가 수정되었습니다!', () => {
        redirect('/mypage?reload=true')
      })
      setLoggedMember(errors)
    }
  }, [errors, setLoggedMember]) // alertDialog 넣으면 안 됨.

  const onChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const fileUploadCallback = useCallback((items) => {
    setForm((prev) => ({ ...prev, profileImage: items[0] }))
  }, [])

  const fileDeleteCallback = useCallback(() => {
    setForm((prev) => {
      const data = { ...prev }
      delete data.profileImage
      return data
    })
  }, [])

  const onSubmitWithPassword = useCallback(async () => {
    if (!password.trim()) {
      setPwError('비밀번호를 입력하세요.')
      return
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/member/token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email, // 현재 로그인된 회원 이메일
            password: password, // 입력한 비밀번호
          }),
        },
      )

      if (res.ok) {
        setPwAuthenticated(true)
        setPwModalOpen(false)
        setPwError('')
      } else {
        const data = await res.json().catch(() => ({}))
        setPwError(data.message || '비밀번호가 올바르지 않습니다.')
      }
    } catch (err) {
      console.error(err)
      setPwError('서버 오류가 발생했습니다.')
    }
  }, [password, form])

  const handleCloseModal = useCallback(() => {
    if (!pwAuthenticated) {
      history.back()
    } else {
      setPwModalOpen(false)
    }
  }, [pwAuthenticated])

  return (
    <>
      {pwAuthenticated && (
        <ProfileForm
          form={form}
          errors={errors}
          action={action}
          pending={pending}
          onChange={onChange}
          fileUploadCallback={fileUploadCallback}
          fileDeleteCallback={fileDeleteCallback}
          isSocialUser={isSocialUser}
        />
      )}

      <LayerPopup
        title="비밀번호 확인"
        isOpen={pwModalOpen}
        onClose={handleCloseModal}
        width={400}
      >
        <PwModalContent>
          <div className="password-wrapper">
            <input
              type={showPw ? 'text' : 'password'}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPw((prev) => !prev)}
              aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showPw ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
            </button>
          </div>

          {pwError && <p>{pwError}</p>}

          <div className="button-group">
            <Button type="button" className="cancel" onClick={handleCloseModal}>
              취소
            </Button>
            <Button
              type="button"
              className="confirm"
              onClick={onSubmitWithPassword}
            >
              확인
            </Button>
          </div>
        </PwModalContent>
      </LayerPopup>
    </>
  )
}

export default React.memo(ProfileContainer)

{/* <LayerPopup
        title="비밀번호 확인"
        isOpen={pwModalOpen}
        onClose={handleCloseModal}
        width={400}
      >
        <PwModalContent>
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
          />
          {pwError && <p className="text-red-500 mt-2">{pwError}</p>}
          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" onClick={handleCloseModal}>
              취소
            </Button>
            <Button type="button" onClick={onSubmitWithPassword}>
              확인
            </Button>
          </div>
        </PwModalContent>
      </LayerPopup> */}