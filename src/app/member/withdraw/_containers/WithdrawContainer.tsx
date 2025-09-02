import WithdrawComponent from '../_components/WithdrawComponent'

export default function WithdrawContainer({
  loggedEmail,
}: {
  loggedEmail: string
}) {
  return <WithdrawComponent loggedEmail={loggedEmail} />
}
