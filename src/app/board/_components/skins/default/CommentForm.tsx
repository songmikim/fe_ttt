'use client'
import React from 'react'
import styled from 'styled-components'
import type { CommentType } from '@/app/board/_types/CommentType'
import Loading from '@/app/_global/components/Loading'
import MessageBox from '@/app/_global/components/MessageBox'
import color from '@/app/_global/styles/color'
const { dark, light } = color

const StyledForm = styled.form`
  border: 1px solid #ccc;
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 3px;

  .top {
    margin-bottom: 5px;
    input {
      border: 1px solid ${dark};
      width: 120px;
      height: 40px;
      padding: 0 10px;
    }

    input + input {
      margin-left: 5px;
    }
  }

  .bottom {
    display: flex;
    height: 100px;

    textarea {
      flex-grow: 1;
      resize: none;
      margin-right: 5px;
      border: 1px solid ${dark};
      padding: 10px;
    }

    button {
      width: 120px;
      background: ${dark};
      color: ${light};
      border: 0;
      cursor: pointer;
    }
  }
`

const CommentForm = ({
  form,
  onChange,
  action,
  errors,
  pending,
}: CommentType) => {
  return (
    <StyledForm action={action} autoComplete="off">
      <input type="hidden" name="boardDataSeq" defaultValue={form?.boardDataSeq} />
      <input type="hidden" name="guest" defaultValue={'' + form?.guest} />
      <input
        type="hidden"
        name="mode"
        defaultValue={form?.mode ?? 'comment_write'}
      />
      {form?.mode === 'comment_update' && (
        <input type="hidden" name="seq" defaultValue={form?.seq} />
      )}
      <input
        type="hidden"
        name="boardDataSeq"
        defaultValue={form?.boardDataSeq ?? ''}
      />
      <MessageBox color="danger">{errors?.mode}</MessageBox>
      <MessageBox color="danger">{errors?.seq}</MessageBox>
      <MessageBox color="danger">{errors?.boardDataSeq}</MessageBox>
      <MessageBox color="danger">{errors?.global}</MessageBox>

      <div className="top">
        <input
          type="text"
          name="commenter"
          placeholder="작성자"
          value={form?.commenter ?? ''}
          onChange={onChange}
        />
        <MessageBox color="danger">{errors?.commenter}</MessageBox>

        {form?.guest && (
          <>
            <input
              type="password"
              name="guestPw"
              value={form?.guestPw ?? ''}
              onChange={onChange}
              placeholder="비밀번호"
            />
            <MessageBox color="danger">{errors?.guestPw}</MessageBox>
          </>
        )}
      </div>
      <div className="bottom">
        <textarea
          name="content"
          value={form?.content ?? ''}
          onChange={onChange}
          placeholder="댓글을 입력하세요."
        />
        <button type="submit" disabled={pending}>
          {form?.mode === 'comment_update' ? '수정하기' : '작성하기'}{' '}
          <Loading loading={Boolean(pending)} />
        </button>
      </div>
      <MessageBox color="danger">{errors?.content}</MessageBox>
    </StyledForm>
  )
}

export default React.memo(CommentForm)