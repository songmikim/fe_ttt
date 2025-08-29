import ContentBox from '@/app/_global/components/ContentBox'
import EventDetailContainer from '../_containers/EventDetailContainer'
import { MainTitle } from '../../_global/components/TitleBox'
import { getEvent } from '../_services/actions'
import type { EventType } from '../_types'

export default async function EventDetailPage({ params }) {
  const { hash } = await params 
  const event: EventType | null = await getEvent(hash)

  if (!event) {
    return null
  }
  
  return (
    <ContentBox style={{ paddingTop: 30 }}>
      <MainTitle border="true">환경 행사</MainTitle>
      <EventDetailContainer event={event} />
    </ContentBox>
  )
}
