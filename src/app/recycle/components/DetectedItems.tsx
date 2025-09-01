import styled, { css } from 'styled-components'
import { color } from '../libs'

const StyledItem = styled.li<{ category?: string }>`
  border: 3px solid #000;

  ${({ category }) =>
    category &&
    css`
      border-color: ${color[category] ?? '#000'};
      .category {
        background: ${color[category] ?? '#000'};
        color: ${category == '비닐' ? '#000' : '#fff'};
      }
    `}
`

const StyledItems = styled.ul`
  display: flex;
  flex-wrap: wrap;
  width: 640px;

  li {
    width: 100px;
    height: 100px;

    margin: 20px auto;

    position: relative;

    .category {
      position: absolute;
      bottom: 0;
      left: 0;
      text-align: center;
      height: 25px;
      line-height: 25px;
      width: 100%;
    }
  }

  li + li {
    margin-left: 10px;
  }
`

export default function DetectedItems({ items }) {
  return (
    items &&
    items.length > 0 && (
      <StyledItems>
        {items.map(({ category1, category2, dataUrl }, i) => (
          <StyledItem
            category={category1}
            key={category2 + '-' + i}
            style={{
              backgroundImage: `url(${dataUrl})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
              backgroundSize: 'contain',
            }}
          >
            <div className="category">{category2}</div>
          </StyledItem>
        ))}
      </StyledItems>
    )
  )
}
