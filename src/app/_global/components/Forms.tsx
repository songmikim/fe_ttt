'use client'
import React from 'react'
import styled, { css } from 'styled-components'
import color from '../styles/color'
import fontsize from '../styles/fontsize'
const { dark, light, white, black } = color
const { medium } = fontsize

const commonStyle = css`
  color: ${dark};
  border: 1px solid ${light};
  font-size: ${medium};
  padding: 10px;
  border-radius: 3px;
  width: 100%;
  &:hover,
  &:focus {
    border-color: ${dark};
  }

  & + & {
    margin-top: 10px;
  }
`

type CommonType = {
  children?: React.ReactNode
  width?: number
  height?: number
}

export const Input = styled.input<CommonType>`
  ${commonStyle}
  height: 50px;
  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}
  ${({ height }) =>
    height &&
    css`
      height: ${height}px;
    `}
`

export const Textarea = styled.textarea<CommonType>`
  ${commonStyle}
  height: 150px;
  resize: none;
  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}
  ${({ height }) =>
    height &&
    css`
      height: ${height}px;
    `}
`

const tableCommonStyle = css`
  border-spacing: 0;
  padding: 0;
  margin: 0;
  width: 100%;
`
type TableType = {
  thwidth?: number
}
export const TableCols = styled.table<TableType>`
  ${tableCommonStyle}
  th, td {
    border-bottom: 1px solid #ccc;
    padding: 8px 10px;
  }
  th {
    background: #f8f8f8;
    border-right: 1px solid #ccc;
    width: ${({ thwidth }) => (thwidth ? thwidth : 120)}px;
  }
  tr:first-of-type {
    th,
    td {
      border-top: 1px solid #ccc;
    }
  }

  td {
    svg {
      font-size: 2rem;
      vertical-align: middle;
    }
    span.radio,
    span.checkbox {
      margin-right: 15px;
      cursor: pointer;
    }
  }

  & + & {
    margin-top: 30px;
  }
`

export const TableRows = styled.table`
  ${tableCommonStyle}
  thead {
    th {
      background: ${black};
      color: ${white};
      font-size: ${medium};
      height: 45px;
      padding: 0 10px;
    }
    th + th {
      border-left: 1px solid ${light};
    }
  }

  tbody {
    td {
      border-bottom: 1px solid #ccc;
      padding: 10px;
    }
  }
`