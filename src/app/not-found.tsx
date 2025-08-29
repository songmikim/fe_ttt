import ErrorPage from './_global/components/ErrorPage'

export default function NotFound() {
  return (
    <ErrorPage
      statusCode={404}
      title="페이지를 찾을 수 없습니다."
      description="요청하신 페이지가 존재하지 않습니다."
    />
  )
}
