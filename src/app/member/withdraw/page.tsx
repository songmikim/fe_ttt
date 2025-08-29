import { getLoggedMember } from '../_services/actions'
import WithdrawContainer from './WithdrawContainer'
export default async function FindPasswordPage() {
  const loggedMember = await getLoggedMember()
  const loggedEmail = loggedMember?.email ?? ''

  return (
    <div className="container">
      <h1>회원 탈퇴하기</h1>
      <WithdrawContainer loggedEmail={loggedEmail} />
    </div>
  )
}
