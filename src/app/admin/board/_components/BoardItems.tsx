'use client'
import React from 'react'
import styled from 'styled-components'
import type { BoardConfigType } from '@/app/board/_types/BoardType'
import { TableRows } from '@/app/_global/components/Forms'
import { Button } from '@/app/_global/components/Buttons'

const StyledForm = styled.form`
  th:nth-of-type(1) {
    width: 45px;
  }
  th:nth-of-type(2) {
    width: 150px;
  }
  th:nth-of-type(3) {
    width: 250px;
  }

  td {
    text-align: center;
  }

  td:last-of-type {
    text-align: left;

    a + a {
      margin-left: 5px;
    }
  }
`

const BoardItems = ({ items }: { items?: Array<BoardConfigType> }) => {
  return (
    <StyledForm autoComplete="off">
      <TableRows>
        <thead>
          <tr>
            <th></th>
            <th>게시판ID</th>
            <th>게시판이름</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items && items.length > 0 ? (
            items.map(({ bid, name }) => (
              <tr key={'board-' + bid}>
                <td></td>
                <td>{bid}</td>
                <td>{name}</td>
                <td>
                  <a href={'/admin/board/update/' + bid}>
                    <Button type="button">설정수정</Button>
                  </a>
                  <a href={'/board/list/' + bid} target="_blank">
                    <Button type="button" color="info">
                      미리보기
                    </Button>
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr className="no-data">
              <td colSpan={4}>조회된 게시판이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </TableRows>
    </StyledForm>
  )
}

export default React.memo(BoardItems)