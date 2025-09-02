'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import classNames from 'classnames'
import styled from 'styled-components'
import color from '@/app/_global/styles/color'
import fontsize from '@/app/_global/styles/fontsize'
import Link from 'next/link'
const { dark } = color
const { big } = fontsize


const MyPageSide = styled.aside`
  width: 240px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 20px;
  font-size: ${big};
  font-weight: 600;

  h2 {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid ${dark};
  }

  a {
    display: block;
    font-size: 16px;
    padding: 10px 15px;
    font-weight: 500;
    color: ${dark};
    border-radius: 4px;
    text-decoration: none;

    &:hover {
      color: #96bc48;
    }
  }

  a.on {
    background: #96bc48;
    color: ${dark};
  }
`

const Side = () => {
  const urlPath = usePathname()
  return (
    <MyPageSide>
      <Link
        href="/mypage"
        className={classNames({ on: urlPath === '/mypage' })}
      >
        홈
      </Link>
      <Link
        href="/mypage/profile"
        className={classNames({ on: urlPath === '/mypage/profile' })}
      >
        개인 정보
      </Link>
      <Link
        href="/mypage/recycle"
        className={classNames({ on: urlPath === '/mypage/recycle' })}
      >
        분리수거 결과 보기
      </Link>
    </MyPageSide>
  )
}



export default React.memo(Side)
