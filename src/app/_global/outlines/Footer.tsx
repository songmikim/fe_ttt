'use client'
import React from 'react'
import styled from 'styled-components'
import color from '../styles/color'
const { dark, light } = color

const StyledFooter = styled.footer`
  background: ${light};
  color: ${dark};
  text-align: center;
  padding: 40px 20px;
  font-size: 14px;

  margin-top: auto;
  min-width: 820px;

  h2 {
    margin-bottom: 10px;
  }

  p {
    margin: 5px 0;
  }
`

const Footer = () => {
  return (
    <StyledFooter>
      <h2>Vinllage</h2>
      <p>주소: 서울특별시 강남구 테헤란로 123, Vinllage 빌딩</p>
      <p>사업자등록번호: 123-45-67890 | 전화: 02-1234-5678 | Vinllage Inc.</p>
      <p>&copy; 2025 Vinllage. All Rights Reserved.</p>
    </StyledFooter>
  )
}

export default React.memo(Footer)
