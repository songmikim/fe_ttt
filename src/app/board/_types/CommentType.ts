import type { BoardType, BoardDataType } from './BoardType'

export type CommentType = {
  form?: CommentDataType
  items?: Array<CommentDataType>
  data?: BoardDataType // 원게시글 데이터
  onChange?: (e: any) => void
  errors?: any
  action?: any
  pending?: boolean
} & BoardType

export type CommentDataType = {
  mode?: 'comment_write' | 'comment_update' | 'comment_delete'
  boardDataSeq?: number // 게시글 번호
  seq?: number // 댓글 번호
  commenter?: string
  guestPw?: string
  content?: string
  member?: any
  guest?: boolean
  editable?: boolean
  mine?: boolean
  createdAt?: Date
  modifiedAt?: Date
  deletedAt?: Date
  canDelete?: boolean
  needAuth?: boolean
}
