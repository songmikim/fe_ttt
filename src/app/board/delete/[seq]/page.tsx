import { get } from '../../_services/BoardData'
import { redirect } from 'next/navigation'
import { getLoggedMember } from '@/app/member/_services/actions'
import { processDelete } from '../../_services/actions'

export default async function DeletePage({
  params,
}: {
  params: Promise<{ seq: number }>
}) {
  const { seq } = await params
  const data = await get(seq)
  const { board } = data

  const member = await getLoggedMember()

  if (data && data.canDelete && data.needAuth ) {

    redirect(`/board/check/${seq}?mode=update`)
  }

  if (board && (data.mine || (member && member.authority === 'ADMIN'))) {
    // 삭제 가능
    await processDelete(seq, board.bid) // 삭제 처리

    // 삭제 처리 후 게시글 목록으로 이동
    redirect(`/board/list/${board.bid}`)
  }

  return (
      <></>
  )
}