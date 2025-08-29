import React from 'react'
import styled from 'styled-components'
import fontsize from '@/app/_global/styles/fontsize'
import color from '@/app/_global/styles/color'

/* 스타일 정리 S */
const { dark, info } = color 
const { normal, extra } = fontsize

const ResultList = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
`
const ResultItem = styled.div`
  width: 220px;
  min-height: 180px;
  border-radius: 12px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: center;
`
const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
  font-size: ${normal};
`

const CategoryItem = styled.button`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: ${extra};
  font-weight: 500;
  background: none;
  border: none;
  cursor: pointer;
  color: ${dark}; 
  &:hover {
    color: ${info};
  }
`

const Images = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const ImageItem = styled.img`
  width: 100%;
  height: 180px;
  border-radius: 8px;
  object-fit: cover;
`
/* 스타일 정리 E */

export type FlatImage = {
  key: string
  category: string
  categoryKey: string
  url: string
  name: string
}

export function ResultComponents({
  items,
  onSelect,
}: {
  items: FlatImage[]
  onSelect: (cat: string) => void
}) {
  if (!items?.length) {
    return <div className="noData">데이터가 없습니다.</div>
  }

  return (
    <ResultList>
      {items.map((img) => (
        <ResultItem key={img.key}>
          <Images>
            <ImageItem src={img.url} alt={img.name} />
          </Images>
          <Categories>
            {img.category && (
              <CategoryItem onClick={() => onSelect(img.categoryKey)}>
                {img.category}
              </CategoryItem>
            )}
          </Categories>
        </ResultItem>
      ))}
    </ResultList>
  )
}
