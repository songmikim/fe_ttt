'use client'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { redirect, useRouter } from 'next/navigation'
import type { CommentDataType } from '@/app/board/_types/CommentType'
import { format } from 'date-fns'
import { nl2br } from '@/app/_global/libs/commons'
import useConfirmDialog from '@/app/_global/hooks/useConfirmDialog'
import color from '@/app/_global/styles/color'
import { deleteComment } from '@/app/board/_services/comment'
const { danger, primary, white } = color
const StyledItems = styled.ul`
  margin-bottom: 30px;
  li {
    border: 1px solid #ccc;
    padding: 15px;
    border-radius: 3px;

    .top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .content {
      padding: 10px;
      border-radius: 3px;
      background: #f8f8f8;
      min-height: 80px;
    }

    .links {
      display: flex;
      justify-content: flex-end;
      height: 40px;
      padding-top: 10px;
      a {
        line-height: 30px;
        cursor: pointer;
        color: ${white};
        padding: 0 15px;
        border-radius: 3px;

        &.btn1 {
          background: ${danger};
        }

        &.btn2 {
          background: ${primary};
        }
      }
      a + a {
        margin-left: 5px;
      }
    }
  }

  li + li {
    margin-top: 10px;
  }
`

const CommentItem = ({ item }: { item: CommentDataType }) => {
  const { seq, commenter, member, content, createdAt } = item
  const confirmDialog = useConfirmDialog()

  const onDelete = useCallback(
    (needAuth) => (e) => {
      e.preventDefault()
      confirmDialog({
        text: '정말 삭제하겠습니까?',
        confirmCallback: () => {
          if (needAuth) {
            redirect(`/board/check/${seq}?mode=comment_delete`)
          } else {
            deleteComment(seq)
          }
        },
      })
    },
    [confirmDialog, seq],
  )

  return (
    <li>
      <div className="top">
        <div className="left">
          {commenter}
          {member && '(' + member.email + ')'}
        </div>
        {createdAt && (
          <div className="right">{format(createdAt, 'yyyy.MM.dd HH:mm')}</div>
        )}
      </div>
      {content && (
        <div
          className="content"
          dangerouslySetInnerHTML={{ __html: nl2br(content) }}
        />
      )}
      {item.canDelete && (
        <div className="links">
          <a className="btn1" onClick={onDelete(item.needAuth)}>
            삭제
          </a>
        </div>
      )}
    </li>
  )
}

const CommentItems = ({ items }: { items?: Array<CommentDataType> }) => {
  return (
    items &&
    items.length > 0 && (
      <StyledItems>
        {items.map((item) => (
          <CommentItem key={'comment-' + item.seq} item={item} />
        ))}
      </StyledItems>
    )
  )
}

export default React.memo(CommentItems)
