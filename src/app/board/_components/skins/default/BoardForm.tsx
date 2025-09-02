'use client'
import React from 'react'
import styled from 'styled-components'
import { MdOutlineImage } from 'react-icons/md'
import type { BoardFormType } from '@/app/board/_types/BoardType'
import MessageBox from '@/app/_global/components/MessageBox'
import { Input, Select, Textarea } from '@/app/_global/components/Forms'
import { SubmitButton } from '@/app/_global/components/Buttons'
import useUser from '@/app/_global/hooks/useUser'
import Editor from '@/app/_global/components/Editor'
import FileUpload from '@/app/_global/components/FileUpload'
import FileItems from '@/app/_global/components/FileItems'
import Loading from '@/app/_global/components/Loading'

const StyledForm = styled.form`
  dl {
    display: flex;

    dt {
      width: 120px;
      background: #f8f8f8;
      padding: 10px 20px;
    }
    dd {
      flex-grow: 1;
      padding: 10px;
    }

    dt,
    dd {
      border-bottom: 1px solid #ccc;

      svg {
        font-size: 2rem;
        vertical-align: middle;
        margin-right: 10px;
        cursor: pointer;
      }
    }
    &:first-of-type {
      dt,
      dd {
        border-top: 1px solid #ccc;
      }
    }

    &:last-of-type {
      margin-bottom: 30px;
    }
  }
`

const BoardForm = ({
  board,
  data,
  action,
  errors,
  pending,
  onChange,
  editorCallback,
  fileUploadCallback,
  fileDeleteCallback,
}: BoardFormType) => {
  const { isLogin } = useUser()

  return (
    board && (
      <StyledForm action={action} autoComplete="off">
        <input type="hidden" name="mode" defaultValue={data.mode} />
        <input type="hidden" name="bid" defaultValue={data.bid} />
        <input type="hidden" name="gid" defaultValue={data.gid} />
        <input type="hidden" name="notice" defaultValue={'' + data.notice} />
        {data.mode === 'update' && (
          <>
            <input type="hidden" name="seq" defaultValue={data.seq} />
            <MessageBox color="danger">{errors?.seq}</MessageBox>
          </>
        )}
        <MessageBox color="danger">{errors?.bid}</MessageBox>
        <MessageBox color="danger">{errors?.gid}</MessageBox>
        <MessageBox color="danger">{errors?.global}</MessageBox>

        <dl>
          <dt>작성자</dt>
          <dd>
            <Input
              type="text"
              name="poster"
              value={data?.poster ?? ''}
              onChange={onChange}
            />
            <MessageBox color="danger">{errors?.poster}</MessageBox>
          </dd>
        </dl>
        { !isLogin && (
          <dl>
            <dt>비밀번호</dt>
            <dd>
              <Input
                type="password"
                name="guestPw"
                value={data?.guestPw ?? ''}
                onChange={onChange}
                suppressHydrationWarning={true}
              />
              <MessageBox color="danger">{errors?.guestPw}</MessageBox>
            </dd>
          </dl>
        )}
        {board.categories && board.categories.length > 0 && (
          <dl>
            <dt>분류</dt>
            <dd>
              <Select name="category" value={data.category} onChange={onChange}>
                {board.categories.map((c) => (
                  <option value={c} key={'category-' + c}>
                    {c}
                  </option>
                ))}
              </Select>
            </dd>
          </dl>
        )}
        <dl>
          <dt>글제목</dt>
          <dd>
            <Input
              type="text"
              name="subject"
              value={data?.subject ?? ''}
              onChange={onChange}
            />
            <MessageBox color="danger">{errors?.subject}</MessageBox>
          </dd>
        </dl>
        <dl>
          <dt>글내용</dt>
          <dd>
            {board.editor ? (
              <>
                <input
                  type="hidden"
                  name="content"
                  defaultValue={data?.content ?? ''}
                />
                <Editor
                  data={data?.content ?? ''}
                  height={350}
                  callback={editorCallback}
                  onChange={onChange}
                />
                {board.imageUpload && (
                  <>
                    <FileUpload
                      gid={data.gid}
                      location="editor"
                      imageOnly={true}
                      callback={fileUploadCallback}
                      title="이미지 추가"
                      icon={<MdOutlineImage />}
                    />
                    <FileItems
                      items={data.editorImages}
                      callback={fileDeleteCallback}
                    />
                  </>
                )}
              </>
            ) : (
              <Textarea
                name="content"
                value={data?.content ?? ''}
                onChange={onChange}
              />
            )}
            <MessageBox color="danger">{errors?.content}</MessageBox>
          </dd>
        </dl>
        {board.attachFile && (
          <dl>
            <dt>파일첨부</dt>
            <dd>
              <FileUpload
                gid={data.gid}
                location="attach"
                callback={fileUploadCallback}
                title="파일 추가"
              />
              <FileItems
                items={data.attachFiles}
                callback={fileDeleteCallback}
              />
            </dd>
          </dl>
        )}
        <SubmitButton type="submit" width={280} disabled={pending}>
          {data.mode === 'update' ? '수정하기' : '작성하기'}
          <Loading loading={pending} />
        </SubmitButton>
      </StyledForm>
    )
  )
}

export default React.memo(BoardForm)