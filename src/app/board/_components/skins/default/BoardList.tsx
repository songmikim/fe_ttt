
import React from 'react'
import type { BoardListType } from '@/app/board/_types/BoardType'
import BoardListItems from './BoardListItems'
import BoardSearchForm from './BoardSearchForm'
import BoardCategory from './BoardCategory'
import styled from 'styled-components'
import color from '@/app/_global/styles/color'
import fontsize from '../../../../_global/styles/fontsize'

const { danger, info, white } = color
const { medium, normal } = fontsize

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

const BoardList = ({ board, items, search }: BoardListType) => {
  return (
    <>
      <BoardCategory board={board} />
      <BoardListItems items={items} />
      <BoardSearchForm search={search} board={board} />
      <StyledLinks>
          {board?.writable && (
            <a 
              href={`/board/write/${board.bid}`}
              className="btn3"
            >
              글 작성
            </a>
          )}
        </StyledLinks>
    </>
  )
}

export default React.memo(BoardList)





