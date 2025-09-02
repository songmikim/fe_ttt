import EmailSenderForm from '@/app/member/_components/EmailSenderForm'
import { EmailCategory } from '../constants/EmailCategory'

export default function FindPasswordPage() {
  return <EmailSenderForm category={EmailCategory.FIND_PASSWORD} />
}
