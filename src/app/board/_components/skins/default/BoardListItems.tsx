'use client'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import { format, formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { BoardDataType } from '@/app/board/_types/BoardType'
import color from '@/app/_global/styles/color'
import fontsize from '@/app/_global/styles/fontsize'

const { small } = fontsize
const { danger, info, white } = color

const StyledItems = styled.ul`
  li {
    display: flex;
    height: 50px;
    border-bottom: 1px solid #ccc;
    padding: 0 10px;

    &:first-of-type {
      border-top: 1px solid #ccc;
    }

    &:hover {
      background: #f8f8f8;
    }

    .post-info {
      min-width: 350px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      span + span {
        margin-left: 10px;
      }
    }

    .subject {
      flex-grow: 1;
      display: flex;
      align-items: center;

      div {
        width: calc(100% - 1px);
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;

        span {
          display: inline-block;
          padding: 7px 8px;
          line-height: 1;
          border-radius: 3px;
          margin-right: 3px;
          color: ${white};
          font-size: ${small};
          &.notice {
            background: ${danger};
          }

          &.category {
            background: ${info};
          }
        }
      }
    }
  }

  .no-data {
    display: block;
    text-align: center;
  }
`

const BoardItem = ({ item }) => {
  const {
    seq,
    subject,
    category,
    notice,
    poster,
    member,
    viewCount,
    createdAt,
  } = item

  const dateStr = useMemo(() => {
    const gap = Date.now() - createdAt.getTime()
    const hours = Math.ceil(gap / (60 * 60 * 1000))
    const mins = Math.floor(gap / (60 * 1000))
    if (mins < 1) return '방금전'

    return hours >= 6
      ? format(createdAt, 'yyyy.MM.dd HH:mm')
      : formatDistanceToNow(createdAt, { locale: ko }) + '전'
  }, [createdAt])
  return (
    <li>
      <a href={'/board/view/' + seq} className="subject">
        <div>
          {notice && <span className="notice">공지</span>}
          {category && <span className="category">{category}</span>}
          {subject}
        </div>
      </a>
      <span className="post-info">
        <span>
          {poster}
          {member && '(' + member.email + ')'}
        </span>
        <span>{dateStr}</span>
        {viewCount > 0 && <span>{viewCount.toLocaleString()}</span>}
      </span>
    </li>
  )
}

const BoardListItems = ({ items }: { items?: Array<BoardDataType> }) => {
  return (
    <StyledItems>
      {items && items.length > 0 ? (
        items.map((item) => (
          <BoardItem key={'board-item-' + item.seq} item={item} />
        ))
      ) : (
        <li className="no-data">조회된 게시글이 없습니다.</li>
      )}
    </StyledItems>
  )
}

export default React.memo(BoardListItems)