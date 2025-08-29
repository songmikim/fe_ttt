import EmailSenderForm from '../_components/EmailSenderForm'
export default function FindPasswordPage() {
  return (
    <div className="container">
      <h1>비밀번호 찾기</h1>
      <EmailSenderForm mappingValue="/member/find-pw" />
    </div>
  )
}
