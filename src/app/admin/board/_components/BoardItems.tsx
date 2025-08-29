'use client'
import React from 'react'
import styled from 'styled-components'
import type { BoardConfigType } from '@/app/board/_types/BoardType'
import { TableRows } from '@/app/_global/components/Forms'
import { Button } from '@/app/_global/components/Buttons'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md'

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

  .table-action {
    border-bottom: 1px solid #ccc;
    padding: 10px;
  }
`

const BoardItems = ({
  items,
  onToggle,
  isCheckAll,
  onRemove,
}: {
  items?: Array<BoardConfigType>
  onToggle: (bid?: string, mode?: 'check' | 'uncheck') => void
  onRemove: () => void
  isCheckAll: boolean
}) => {
  return (
    <StyledForm autoComplete="off">
      <TableRows>
        <thead>
          <tr>
            <th
              onClick={() =>
                onToggle(undefined, isCheckAll ? 'uncheck' : 'check')
              }
            >
              {isCheckAll ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
            </th>
            <th>게시판ID</th>
            <th>게시판이름</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items && items.length > 0 ? (
            items.map(({ chk, bid, name }) => (
              <tr key={'board-' + bid}>
                <td onClick={() => onToggle(bid)}>
                  {chk ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
                </td>
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
            <tr>
              <td colSpan={4} className="no-data">
                조회된 게시판이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </TableRows>
      {items && items.length > 0 && (
        <div className="table-action">
          <Button type="button" color="warning" width={200} onClick={onRemove}>
            선택한 게시판 삭제하기
          </Button>
        </div>
      )}
    </StyledForm>
  )
}

export default React.memo(BoardItems)