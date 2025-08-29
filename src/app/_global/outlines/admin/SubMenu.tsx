import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import useMenu from '../../hooks/useMenu'

const StyleSubMenu = styled.nav``

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
