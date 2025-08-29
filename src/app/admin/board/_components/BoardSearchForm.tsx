'use client'
import React from 'react'
import styled from 'styled-components'
import { Input, Select, TableCols } from '@/app/_global/components/Forms'
import { SubmitButton } from '@/app/_global/components/Buttons'

const StyledForm = styled.form``

const BoardSearchForm = ({ search }) => {
  return (
    <StyledForm method="GET" autoComplete="off" className="mb30">
      <TableCols thwidth={120} className="mb30">
        <tbody>
          <tr>
            <th>키워드 검색</th>
            <td className="flex">
              <Select
                name="sopt"
                className="w120 mr5"
                defaultValue={search.sopt}
              >
                <option defaultValue="ALL">통합검색</option>
                <option defaultValue="BID">게시판 ID</option>
                <option defaultValue="NAME">게시판이름</option>
              </Select>
              <Input
                type="text"
                name="skey"
                defaultValue={search.skey ?? ''}
                placeholder="검색 키워드를 입력하세요."
              />
            </td>
          </tr>
        </tbody>
      </TableCols>
      <SubmitButton type="submit" width={250}>
        검색하기
      </SubmitButton>
    </StyledForm>
  )
}

export default React.memo(BoardSearchForm)