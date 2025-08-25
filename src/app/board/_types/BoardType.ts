export type AuthorityType = 'ALL' | 'MEMBER' | 'ADMIN'
export type SkinType = 'default' | 'gallery'

export type BoardConfigType = {
  mode?: 'register' | 'update'
  bid: string
  name: string
  rowsForPage: number
  pageCount: number
  skin: SkinType
  category?: string
  active: boolean
  editor: boolean
  imageUpload: boolean
  attachFile: boolean
  comment: boolean
  afterWritingRedirect: boolean
  showViewList: boolean
  listAuthority: AuthorityType
  viewAuthority: AuthorityType
  writeAuthority: AuthorityType
  commentAuthority: AuthorityType
}