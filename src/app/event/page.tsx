import ContentBox from '@/app/_global/components/ContentBox'
import { getEvents } from './_services/actions'
import { MainTitle } from '../_global/components/TitleBox'
import EventListContainer from './_containers/EventListContainer'
import type CommonSearchType from '../_global/types/CommonSearchType'

export default async function EventPage({ searchParams }: any) {
  const params = await searchParams
  const search: CommonSearchType = {
    page: Number(params?.page as string) || 1,
    sopt: params?.sopt as string,
    skey: params?.skey as string,
    sdate: params?.sdate as string,
    edate: params?.edate as string,
  }
  const { items: events, pagination } = await getEvents(search)
  return (
    <ContentBox style={{ paddingTop: 30 }}>
      <MainTitle border="true">환경 행사</MainTitle>
      <EventListContainer
        events={events}
        pagination={pagination}
        search={search}
      />
    </ContentBox>
  )
}
