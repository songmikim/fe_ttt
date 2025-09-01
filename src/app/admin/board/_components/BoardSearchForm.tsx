'use client'
import React from 'react'
import styled from 'styled-components'
import { Input, Select, TableCols } from '@/app/_global/components/Forms'
import { Button } from '@/app/_global/components/Buttons'

const StyledForm = styled.form`
  margin-bottom: 30px;
`

const Td = styled.td`
  display: flex;
  align-items: center;
  gap: 8px;

  & > * {
    margin: 0 !important;
  }
`

const SmallSelect = styled(Select)`
  width: 150px;
`

const SmallInput = styled(Input)`
  width: 250px;
`

const BoardSearchForm = ({ search }) => {
  return (
    <StyledForm method="GET" autoComplete="off">
      <TableCols thwidth={120} className="mb30">
        <tbody>
          <tr>
            <th>키워드 검색</th>
            <Td>
              <SmallSelect name="sopt" defaultValue={search.sopt}>
                <option defaultValue="ALL">통합검색</option>
                <option defaultValue="BID">게시판 ID</option>
                <option defaultValue="NAME">게시판이름</option>
              </SmallSelect>
              <SmallInput
                type="text"
                name="skey"
                defaultValue={search.skey ?? ''}
                placeholder="검색 키워드를 입력하세요."
              />
              <Button type="submit" width={120}>검색하기</Button>
            </Td>
          </tr>
        </tbody>
      </TableCols>
    </StyledForm>
  )
}

export default React.memo(BoardSearchForm)