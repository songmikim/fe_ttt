import ContentBox from '@/app/_global/components/ContentBox'
import { getEvents } from './_services/actions'
import { MainTitle } from '../_global/components/TitleBox'
import EventListContainer from './_containers/EventListContainer'
import type CommonSearchType from '../_global/types/CommonSearchType'

export default async function EventPage({ searchParams }: any) {
  const search: CommonSearchType = {
    page: Number(searchParams?.page as string) || 1,
    sopt: searchParams?.sopt as string,
    skey: searchParams?.skey as string,
    sdate: searchParams?.sdate as string,
    edate: searchParams?.edate as string,
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
