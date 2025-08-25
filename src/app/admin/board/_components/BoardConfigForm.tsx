import React from 'react'
import styled from 'styled-components'
import {
  MdOutlineRadioButtonChecked,
  MdOutlineRadioButtonUnchecked,
} from 'react-icons/md'
import MessageBox from '@/app/_global/components/MessageBox'
import { Input, Textarea, TableCols } from '@/app/_global/components/Forms'
import { SubmitButton } from '@/app/_global/components/Buttons'

const StyledForm = styled.form``

const BoardConfigForm = ({
  form,
  errors,
  pending,
  action,
  onChange,
  onKeyValue,
}) => {
  return (
    <StyledForm action={action} autoComplete="off">
      <input type="hidden" name="mode" value={form.mode} />
      <input type="hidden" name="active" value={form.active} />
      <input type="hidden" name="editor" value={form.editor} />
      <input type="hidden" name="imageUpload" value={form.imageUpload} />
      <input type="hidden" name="attachFile" value={form.attachFile} />
      <input type="hidden" name="comment" value={form.comment} />
      <input
        type="hidden"
        name="afterWritingRedirect"
        value={form.afterWritingRedirect}
      />
      <input type="hidden" name="showViewList" value={form.showViewList} />
      <input type="hidden" name="skin" value={form.skin} />
      <input type="hidden" name="listAuthority" value={form.listAuthority} />
      <input type="hidden" name="viewAuthority" value={form.viewAuthority} />
      <input type="hidden" name="writeAuthority" value={form.writeAuthority} />
      <input
        type="hidden"
        name="commentAuthority"
        value={form.commentAuthority}
      />

      <MessageBox color="danger">{errors?.global}</MessageBox>
      <TableCols thwidth={180}>
        <tbody>
          <tr>
            <th>게시판 아이디</th>
            <td>
              {form.mode === 'update' ? (
                <>
                  <input type="hidden" name="bid" value={form.bid} />
                  {form.bid}
                </>
              ) : (
                <Input
                  type="text"
                  name="bid"
                  value={form.bid}
                  onChange={onChange}
                />
              )}
              <MessageBox color="danger">{errors?.bid}</MessageBox>
            </td>
          </tr>
          <tr>
            <th>게시판 이름</th>
            <td>
              <Input
                type="text"
                name="name"
                value={form.name}
                onChange={onChange}
              />
              <MessageBox color="danger">{errors?.name}</MessageBox>
            </td>
          </tr>
          <tr>
            <th>사용여부</th>
            <td>
              <span
                className="radio"
                onClick={() => onKeyValue('active', true)}
              >
                {form.active ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}{' '}
                사용
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('active', false)}
              >
                {!form.active ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                미사용
              </span>
            </td>
          </tr>
          <tr>
            <th>한페이지 행수</th>
            <td>
              <Input
                type="number"
                name="rowsForPage"
                value={form.rowsForPage}
                onChange={onChange}
              />
            </td>
          </tr>
          <tr>
            <th>페이징 갯수</th>
            <td>
              <Input
                type="number"
                name="pageCount"
                value={form.pageCount}
                onChange={onChange}
              />
            </td>
          </tr>
          <tr>
            <th>에디터 사용</th>
            <td>
              <span
                className="radio"
                onClick={() => onKeyValue('editor', true)}
              >
                {form.editor ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                사용
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('editor', false)}
              >
                {!form.editor ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                미사용
              </span>
            </td>
          </tr>
          <tr>
            <th>이미지 업로드</th>
            <td>
              <span
                className="radio"
                onClick={() => onKeyValue('imageUpload', true)}
              >
                {form.imageUpload ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                사용
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('imageUpload', false)}
              >
                {!form.imageUpload ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                미사용
              </span>
            </td>
          </tr>
          <tr>
            <th>파일 첨부</th>
            <td>
              <span
                className="radio"
                onClick={() => onKeyValue('attachFile', true)}
              >
                {form.attachFile ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                사용
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('attachFile', false)}
              >
                {!form.attachFile ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                미사용
              </span>
            </td>
          </tr>
          <tr>
            <th>댓글 사용</th>
            <td>
              <span
                className="radio"
                onClick={() => onKeyValue('comment', true)}
              >
                {form.comment ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                사용
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('comment', false)}
              >
                {!form.comment ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                미사용
              </span>
            </td>
          </tr>
          <tr>
            <th>글작성 후 이동</th>
            <td>
              <span
                className="radio"
                onClick={() => onKeyValue('afterWritingRedirect', true)}
              >
                {form.afterWritingRedirect ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                글보기
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('afterWritingRedirect', false)}
              >
                {!form.afterWritingRedirect ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                글목록
              </span>
            </td>
          </tr>
          <tr>
            <th>글보기 하단 목록</th>
            <td>
              <span
                className="radio"
                onClick={() => onKeyValue('showViewList', true)}
              >
                {form.showViewList ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                노출
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('showViewList', false)}
              >
                {!form.showViewList ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                미노출
              </span>
            </td>
          </tr>
        </tbody>
      </TableCols>
      <h2>분류 설정</h2>
      <TableCols thwidth={180}>
        <tbody>
          <tr>
            <th>분류</th>
            <td>
              <Textarea
                name="category"
                value={form.category}
                onChange={onChange}
                placeholder="여러개의 분류는 엔터로 줄개행하여 입력"
              />
            </td>
          </tr>
        </tbody>
      </TableCols>
      <h2>스킨 설정</h2>
      <TableCols thwidth={180}>
        <tbody>
          <tr>
            <th>스킨</th>
            <td>
              <span
                className="radio"
                onClick={() => onKeyValue('skin', 'default')}
              >
                {form.skin === 'default' ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                기본 스킨(default)
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('skin', 'gallery')}
              >
                {form.skin === 'gallery' ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                갤러리 스킨(gallery)
              </span>
            </td>
          </tr>
        </tbody>
      </TableCols>
      <h2>권한 설정</h2>
      <TableCols thwidth={180} className="mb30">
        <tbody>
          <tr>
            <th>글목록 권한</th>
            <td>
              <span
                className="radio"
                onClick={() => onKeyValue('listAuthority', 'ALL')}
              >
                {form.listAuthority === 'ALL' ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                비회원 + 회원 + 관리자
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('listAuthority', 'MEMBER')}
              >
                {form.listAuthority === 'MEMBER' ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                회원 + 관리자
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('listAuthority', 'ADMIN')}
              >
                {form.listAuthority === 'ADMIN' ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                관리자
              </span>
            </td>
          </tr>
          <tr>
            <th>글보기 권한</th>
            <td>
              <span
                className="radio"
                onClick={() => onKeyValue('viewAuthority', 'ALL')}
              >
                {form.viewAuthority === 'ALL' ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                비회원 + 회원 + 관리자
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('viewAuthority', 'MEMBER')}
              >
                {form.viewAuthority === 'MEMBER' ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                회원 + 관리자
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('viewAuthority', 'ADMIN')}
              >
                {form.listAuthority === 'ADMIN' ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                관리자
              </span>
            </td>
          </tr>
          <tr>
            <th>글쓰기 권한</th>
            <td>
              <span
                className="radio"
                onClick={() => onKeyValue('writeAuthority', 'ALL')}
              >
                {form.writeAuthority === 'ALL' ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                비회원 + 회원 + 관리자
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('writeAuthority', 'MEMBER')}
              >
                {form.writeAuthority === 'MEMBER' ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                회원 + 관리자
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('writeAuthority', 'ADMIN')}
              >
                {form.writeAuthority === 'ADMIN' ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                관리자
              </span>
            </td>
          </tr>
          <tr>
            <th>댓글 권한</th>
            <td>
              <span
                className="radio"
                onClick={() => onKeyValue('commentAuthority', 'ALL')}
              >
                {form.commentAuthority === 'ALL' ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                비회원 + 회원 + 관리자
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('commentAuthority', 'MEMBER')}
              >
                {form.commentAuthority === 'MEMBER' ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                회원 + 관리자
              </span>
              <span
                className="radio"
                onClick={() => onKeyValue('commentAuthority', 'ADMIN')}
              >
                {form.commentAuthority === 'ADMIN' ? (
                  <MdOutlineRadioButtonChecked />
                ) : (
                  <MdOutlineRadioButtonUnchecked />
                )}
                관리자
              </span>
            </td>
          </tr>
        </tbody>
      </TableCols>
      <SubmitButton type="submit" disabled={pending} width={250} color="dark">
        {form.mode === 'update' ? '수정하기' : '등록하기'}
      </SubmitButton>
    </StyledForm>
  )
}

export default React.memo(BoardConfigForm)