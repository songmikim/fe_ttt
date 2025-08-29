'use client'
import React from 'react'
import styled from 'styled-components'
import { format } from 'date-fns'
import type { BoardViewType } from '@/app/board/_types/BoardType'
import { nl2br } from '@/app/_global/libs/commons'
import FileItems from '@/app/_global/components/FileItems'
import color from '@/app/_global/styles/color'
import fontsize from '../../../../_global/styles/fontsize'

const { danger, info, white } = color
const { medium, normal } = fontsize

const Wrapper = styled.ul`
  li + li {
    margin-top: 10px;
  }

  li {
    border: 1px solid #ccc;
    border-radius: 3px;
    padding: 15px;

    &.subject {
      font-size: ${medium};
      span {
        margin-right: 5px;
        display: inline-block;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: ${normal};
        color: ${white};

        &.notice {
          background: ${danger};
        }

        &.category {
          background: ${info};
        }
      }
    }

    &.post-info {
      display: flex;
      justify-content: space-between;

      .left span {
        margin-right: 10px;
      }

      .right span {
        margin-left: 10px;
      }
    }

    &.content {
      word-break: break-all;
      margin-bottom: 10px;
      min-height: 350px;
    }
  }
`

const StyledLinks = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: flex-end;
  height: 45px;

  a {
    line-height: 45px;
    margin-left: 5px;
    font-size: ${medium};
    color: ${white};
    border-radius: 3px;
    padding: 0 15px;

    &.btn1 {
      background: ${color.primary};
    }

    &.btn2 {
      background: ${color.danger};
    }

    &.btn3 {
      background: ${color.warning};
    }

    &.btn4 {
      background: ${color.info};
    }
  }
`

const BoardView = ({ board, data }: BoardViewType) => {
  return (
    data && (
      <>
        <Wrapper>
          <li className="subject">
            {data.notice && <span className="notice">공지</span>}
            {data.category && <span className="category">{data.category}</span>}

            {data.subject}
          </li>
          <li className="post-info">
            <div className="left">
              <span>
                작성자: {data.poster}
                {data.member && '(' + data.member.email + ')'}
              </span>
              <span>IP: {data.ip}</span>
            </div>
            <div className="right">
              <span>조회수: {data?.viewCount?.toLocaleString()}</span>
              {data.createdAt && (
                <span>
                  작성일시: {format(data.createdAt, 'yyyy.MM.dd HH:mm')}
                </span>
              )}
            </div>
          </li>
          {data.content && (
            <li
              className="content"
              dangerouslySetInnerHTML={{
                __html: data.plainText ? nl2br(data.content) : data.content,
              }}
            />
          )}
        </Wrapper>
        <FileItems items={data.attachFiles} />
        <StyledLinks>
          {data.canEdit && (
            <a href={'/board/delete/' + data.seq} className="btn2">
              글삭제
            </a>
            )}
          {data.canDelete && (
            <a href={'/board/update/' + data.seq} className="btn3">
              글수정
            </a>
          )}
        </StyledLinks>
      </>
    )
  )
}

export default React.memo(BoardView)