import { getLoggedMember } from './../_services/actions'
import WithdrawContainer from './_containers/WithdrawContainer'

export default async function WithdrawPage() {
  const loggedMember = await getLoggedMember()
  const loggedEmail = loggedMember?.email ?? ''

  return <WithdrawContainer loggedEmail={loggedEmail} />
}
