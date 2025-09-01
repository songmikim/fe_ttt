import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import useMenu from '../../hooks/useMenu'

const StyleSubMenu = styled.nav`
  display: flex;
  gap: 12px; /* 메뉴 간 간격 */
  margin-bottom: 20px;

  a {
    font-size: 18px; /* 글씨 크게 */
    font-weight: 600;
    padding: 6px 12px; /* 버튼처럼 여백 */
    border-radius: 6px;
    background: #f5f5f5; /* 버튼 배경 */
    color: #333;
    text-decoration: none;

    &:hover {
      background: #e0e0e0; /* hover 효과 */
      color: #000;
    }
  }
`

const SubMenu = () => {
  const items = useMenu()

  return (
    <StyleSubMenu>
      {items.length > 0 &&
        items.map(({ link, text }, i) => (
          <Link href={link} key={link + '-' + i}>
            {text}
          </Link>
        ))}
    </StyleSubMenu>
  )
}

export default React.memo(SubMenu)
