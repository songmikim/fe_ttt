'use client'
import React from 'react'
import styled, { css } from 'styled-components'

type ContentBoxType = {
  children: React.ReactNode
  width?: number
}

const ContentBox = styled.section<ContentBoxType>`
  padding: 50px 10px;
  min-width: 320px;
  max-width: 1150px;
  margin: 0 auto;
  ${({ width }) =>
    width &&
    css`
      max-width: ${width}px;
    `}
`

export default React.memo(ContentBox)