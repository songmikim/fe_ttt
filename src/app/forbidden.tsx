import ErrorPage from './_global/components/ErrorPage'

export default function Forbidden() {
  return (
    <ErrorPage statusCode={403} title="접근 권한이 없습니다." />
  )
}
