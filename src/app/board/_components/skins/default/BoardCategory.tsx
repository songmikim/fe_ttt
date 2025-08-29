'use client'
import React from 'react'
import { useSearchParams } from 'next/navigation'
import styled from 'styled-components'
import classNames from 'classnames'
import { BoardConfigType } from '@/app/board/_types/BoardType'
import color from '@/app/_global/styles/color'
import fontsize from '@/app/_global/styles/fontsize'
const { black, white } = color
const { medium } = fontsize

const StyledNav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  height: 40px;
  margin-bottom: 30px;

  a {
    border: 1px solid ${black};
    color: ${black};
    border-radius: 20px;
    padding: 0 20px;
    font-size: ${medium};
    line-height: 45px;

    &.on {
      background: ${black};
      color: ${white};
    }
  }
  a + a {
    margin-left: 10px;
  }
`

const BoardCategory = ({ board }: { board?: BoardConfigType }) => {
  const searchParams = useSearchParams()
  const _category = searchParams.get('category')
  return (
    board &&
    board?.categories && (
      <StyledNav>
        <a
          href={'/board/list/' + board.bid}
          className={classNames({ on: !Boolean(_category) })}
        >
          전체
        </a>
        {board.categories.map((category) => (
          <a
            key={'category-' + category}
            href={'/board/list/' + board.bid + '?category=' + category}
            className={classNames({ on: category === _category })}
          >
            {category}
          </a>
        ))}
      </StyledNav>
    )
  )
}

export default React.memo(BoardCategory)