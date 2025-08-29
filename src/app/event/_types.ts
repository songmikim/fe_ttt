export type EventType = {
  hash: number
  link: string
  title: string
  content: string | null
  image?: string
  html: boolean
  date: string
}

export type PaginationType = {
  pages: Array<[string, string]>
  page: number
  prevRangePage: number
  nextRangePage: number
  lastPage: number
  baseUrl: string
}

export type EventListDataType = {
  items: EventType[]
  pagination: PaginationType
}