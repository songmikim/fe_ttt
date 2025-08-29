'use client'
import React from 'react'
import styled from 'styled-components'
import classNames from 'classnames'
import {
  MdFirstPage,
  MdLastPage,
  MdArrowBackIos,
  MdArrowForwardIos,
} from 'react-icons/md'
import color from '../styles/color'
import fontsize from '../styles/fontsize'

const { medium } = fontsize
const { black, white } = color

const Wrapper = styled.div`
  margin: 20px auto;
  display: flex;
  justify-content: center;
  height: 45px;
  .page {
    border: 1px solid ${black};
    font-size: ${medium};
    text-align: center;
    line-height: 43px;
    border-radius: 3px;
    min-width: 45px;
    padding: 0 5px;
    cursor: pointer;
    &.on {
      background: ${black};
      color: ${white};
    }
  }

  .page + .page {
    margin-left: 3px;
  }
`

type PropType = {
  pagination?: any
  onClick?: (page: number) => void
}

const PageItem = ({
  pages,
  page,
  onClick,
  icon,
}: {
  pages: Array<string>
  page: number
  onClick?: (page: number) => void
  icon?: React.ReactNode
}) => {
  return onClick ? (
    <span
      onClick={() => onClick(Number(pages[0]))}
      className={classNames('page', { on: page === Number(pages[0]) })}
    >
      {icon ? icon : pages[0]}
    </span>
  ) : (
    <a
      href={pages[1]}
      className={classNames('page', { on: page === Number(pages[0]) })}
    >
      {icon ? icon : pages[0]}
    </a>
  )
}

const Pagination = ({ pagination, onClick }: PropType) => {
  if (!pagination || pagination.pages.length === 0) return <></>

  const { pages, page, prevRangePage, nextRangePage, lastPage, baseUrl } =
    pagination

  return (
    <Wrapper>
      {prevRangePage > 0 && (
        <>
          <PageItem
            pages={['1', `${baseUrl}1`]}
            page={page}
            onClick={onClick}
            icon={<MdFirstPage />}
          />
          <PageItem
            pages={[prevRangePage, `${baseUrl}${prevRangePage}`]}
            page={page}
            onClick={onClick}
            icon={<MdArrowBackIos />}
          />
        </>
      )}
      {pages.map((p) => (
        <PageItem
          key={'page-' + p[0]}
          pages={p}
          page={page}
          onClick={onClick}
        />
      ))}
      {nextRangePage > 0 && (
        <>
          <PageItem
            pages={[nextRangePage, `${baseUrl}${nextRangePage}`]}
            page={page}
            icon={<MdArrowForwardIos />}
            onClick={onClick}
          />
          <PageItem
            pages={[lastPage, `${baseUrl}${lastPage}`]}
            page={page}
            icon={<MdLastPage />}
            onClick={onClick}
          />
        </>
      )}
    </Wrapper>
  )
}

export default React.memo(Pagination)