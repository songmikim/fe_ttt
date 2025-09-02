'use client'
import React from 'react'
import styled from 'styled-components'
import { MdSearch } from 'react-icons/md'
import type {
  BoardConfigType,
  BoardSearchType,
} from '@/app/board/_types/BoardType'
import color from '@/app/_global/styles/color'
const { black, white } = color

const StyledForm = styled.form`
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  height: 65px;
  select,
  input {
    background: #fff;
    border: 1px solid ${black};
    margin-right: 5px;
  }

  input {
    padding: 0 10px;
    width: 300px;
  }
  button {
    background: ${black};
    border: 0;
    cursor: pointer;
    padding: 0 20px;
    svg {
      font-size: 1.7rem;
      color: ${white};
      position: relative;
      top: 2px;
    }
  }
`

const BoardSearchForm = ({
  search,
  board,
}: {
  search?: BoardSearchType
  board?: BoardConfigType
}) => {
  search = search ?? {}

  return (
    <StyledForm
      method="GET"
      action={'/board/list/' + board?.bid}
      autoComplete="off"
    >
      {search.category && (
        <input type="hidden" name="category" defaultValue={search.category} />
      )}
      <select name="sopt" defaultValue={search?.sopt}>
        <option value="ALL">통합검색</option>
        <option value="SUBJECT">제목</option>
        <option value="CONTENT">내용</option>
        <option value="SUBJECT_CONTENT">제목+내용</option>
        <option value="NAME">이름</option>
      </select>
      <input
        type="text"
        name="skey"
        defaultValue={search?.skey}
        placeholder="검색어를 입력하세요."
      />
      <button type="button">
        <MdSearch />
      </button>
    </StyledForm>
  )
}

export default React.memo(BoardSearchForm)