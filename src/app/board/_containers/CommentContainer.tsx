'use client'
import React, { useState, useCallback, useActionState, useMemo } from 'react'
import Comment from '../_components/Comment'
import type { CommentType, CommentDataType } from '../_types/CommentType'
import { processComment } from '../_services/actions'
import useUser from '@/app/_global/hooks/useUser'

const CommentContainer = ({ board, data, items, form }: CommentType) => {
  const { isLogin, loggedMember } = useUser()
  const [_form, setForm] = useState<CommentDataType>(
    form
      ? form
      : {
          mode: 'comment_write',
          boardDataSeq: data?.seq,
          commenter: loggedMember?.name ?? '',
          guestPw: '',
          content: '',
          guest: !isLogin,
        },
  )

  const [errors, action, pending] = useActionState<any, any>(processComment, {})

  const onChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  return (
    <Comment
      board={board}
      data={data}
      form={_form}
      onChange={onChange}
      errors={errors}
      action={action}
      pending={pending}
      items={items}
      commentable={data?.commentable}
    />
  )
}

export default React.memo(CommentContainer)