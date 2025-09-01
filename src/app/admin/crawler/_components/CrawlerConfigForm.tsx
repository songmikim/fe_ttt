'use client'
import React from 'react'
import styled from 'styled-components'
import { Input, Textarea, TableCols } from '@/app/_global/components/Forms'
import { Button } from '@/app/_global/components/Buttons'
import MessageBox from '@/app/_global/components/MessageBox'
import type { CrawlerConfigType } from '../_types'

const Wrapper = styled.div`
  & + & {
    margin-top: 20px;
  }
`

type Props = {
  index: number
  form: CrawlerConfigType
  onChange: (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void
  onRemove: (index: number) => void
  onTest: (index: number) => void
  errors?: Record<string, string>
}

const CrawlerConfigForm = ({
  index,
  form,
  onChange,
  onRemove,
  onTest,
  errors = {},
}: Props) => {
  return (
    <Wrapper>
      <TableCols thwidth={140}>
        <tbody>
          <tr>
            <th>URL</th>
            <td>
              <Input
                name="url"
                value={form.url}
                onChange={(e) => onChange(index, e)}
              />
              <MessageBox color="danger">{errors?.url}</MessageBox>
            </td>
          </tr>
          <tr>
            <th>키워드</th>
            <td>
              <Textarea
                name="keywords"
                value={form.keywords}
                onChange={(e) => onChange(index, e)}
                height={80}
              />
            </td>
          </tr>
          <tr>
            <th>링크 선택자</th>
            <td>
              <Input
                name="linkSelector"
                value={form.linkSelector}
                onChange={(e) => onChange(index, e)}
              />
              <MessageBox color="danger">{errors?.linkSelector}</MessageBox>
            </td>
          </tr>
          <tr>
            <th>제목 선택자</th>
            <td>
              <Input
                name="titleSelector"
                value={form.titleSelector}
                onChange={(e) => onChange(index, e)}
              />
              <MessageBox color="danger">{errors?.titleSelector}</MessageBox>
            </td>
          </tr>
          <tr>
            <th>날짜 선택자</th>
            <td>
              <Input
                name="dateSelector"
                value={form.dateSelector}
                onChange={(e) => onChange(index, e)}
              />
              <MessageBox color="danger">{errors?.dateSelector}</MessageBox>
            </td>
          </tr>
          <tr>
            <th>내용 선택자</th>
            <td>
              <Input
                name="contentSelector"
                value={form.contentSelector}
                onChange={(e) => onChange(index, e)}
              />
              <MessageBox color="danger">{errors?.contentSelector}</MessageBox>
            </td>
          </tr>
          <tr>
            <th>URL Prefix</th>
            <td>
              <Input
                name="urlPrefix"
                value={form.urlPrefix}
                onChange={(e) => onChange(index, e)}
              />
              <MessageBox color="danger">{errors?.urlPrefix}</MessageBox>
            </td>
          </tr>
          <tr>
            <th>테스트</th>
            <td>
              <Button type="button" onClick={() => onTest(index)}>
                테스트
              </Button>
            </td>
          </tr>
          <tr>
            <th>삭제</th>
            <td>
              <Button
                type="button"
                color="danger"
                onClick={() => onRemove(index)}
              >
                삭제
              </Button>
            </td>
          </tr>
        </tbody>
      </TableCols>
    </Wrapper>
  )
}

export default React.memo(CrawlerConfigForm)
