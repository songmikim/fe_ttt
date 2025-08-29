import React from 'react'
import {  usePathname } from 'next/navigation'
import classNames from 'classnames'
import styled from 'styled-components'
import color from '../../styles/color'
import fontsize from '../../styles/fontsize'
import Link from 'next/link'
const { dark, white } = color
const { big } = fontsize

const StyledAside = styled.aside`
  background: #ccc;
  a {
    display: block;
    height: 55px;
    line-height: 54px;
    border-bottom: 1px solid ${dark};
    font-size: ${big};
    padding: 0 25px;
    font-weight: 500;
  }
  a.on {
    background: ${dark};
    color: ${white};
  }
`

const Side = () => {
  const urlPath = usePathname()
  return (
    <StyledAside>
      <Link
        href="/admin/member"
        className={classNames({ on: urlPath === '/admin/member' })}
      >
        회원 관리
      </Link>
      <Link
        href="/admin/board"
        className={classNames({ on: urlPath === 'admin/board' })}
      >
        게시판 관리
      </Link>
      <Link
        href="/admin/crawler"
        className={classNames({ on: urlPath === '/admin/crawler' })}
      >
        크롤링 관리
      </Link>
    </StyledAside>
  )
}

export default React.memo(Side)
