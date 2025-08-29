'use client'
import { useEffect } from 'react'
import ErrorPage from './_global/components/ErrorPage'
import { Button } from './_global/components/Buttons'

export default function Error({ error, reset }) {
  useEffect(() => {
    // 에러 객체에 대한 로깅
    console.error(error)
  }, [error])

  return (
    <>
      <ErrorPage
        statusCode={500}
        title="서버 오류가 발생했습니다."
        description="잠시 후 다시 시도해주세요."
      />
      <Button type="button" onClick={() => reset()}>
        다시 로딩
      </Button>
    </>
  )
}
