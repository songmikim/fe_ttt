'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import styled from 'styled-components'
import { format, formatISO} from 'date-fns'
import LayerPopup from '../../_global/components/LayerPopup'
import type { BoardDataType } from '@/app/board/_types/BoardType'
import guideImg from '@/app/_global/assets/images/guide.png'
import fontsize from '../../_global/styles/fontsize'

const Title = styled.h1`
  font-size: ${fontsize.big};
  font-weight: bold;
  text-align: center;
  margin: 10px;
`

const List = styled.ul`
  border-top: 1px solid #ccc;

  li {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    padding:6px;
  }
    
  .center {
    text-align: center;
    display: block;
  }  

  a {
    text-decoration: none;
    color: #333;
  }
  time {
    color: #666;
    font-size: ${fontsize.small};
  }
`

const ImageWrapper = styled.div`
  position: relative;
  display: inline-block; 
  width: 500px;
`

const OverlayTexts = styled.div`
  position: absolute;
  width: 220px;
  top: 50px; 
  right: 10px; 
  text-align: left;
  letter-spacing: -1px;

  h2 {
    font-size: 2.3rem;
    margin: 0;
    font-weight: bold;
    color: #222;
    text-align: left;
    padding:0;
  }

  p {
    font-size: ${fontsize.medium}; 
    margin: 4px 0 0;
    color: #555;
  }

`
const Buttons = styled.div`
  margin-top: 20px;
  text-align: right;

  button {
    border: none;
    background: none;
    color: #666;
    cursor: pointer;
    font-size: 0.875rem;
  }
`

type Props = {
  items?: Array<BoardDataType>
}

const NoticeModal = ({ items }: Props) => {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd')
    const hideDate = localStorage.getItem('hideNoticeDate')
    if (hideDate !== today) {
      setOpen(true)
    }
  }, [])

  const handleHideToday = () => {
    const today = format(new Date(), 'yyyy-MM-dd')
    localStorage.setItem('hideNoticeDate', today)
    setOpen(false)
  }

  return (
    <LayerPopup isOpen={open} onClose={() => setOpen(false)} width={500}>
      <ImageWrapper>
        <Image src={guideImg} alt="guide" width={500} />
      <Title>공지사항</Title>
        <OverlayTexts>
          <h2>단순한 배경에서<br/>촬영해주세요</h2>
          <p>배경이 복잡하거나 물건이 많이 보이는 경우에는 정확도가 떨어질 수 있으니, 가능하다면 깔끔한 배경에서 촬영해 주시기 바랍니다.</p>
        </OverlayTexts>
      </ImageWrapper>

      <List>
        {items && items.length > 0 ? (
          items.slice(0, 5).map((item) => (
            <li key={item.seq}>
              <a href={`/board/view/${item.seq}`}>{item.subject}</a>
              {item.createdAt && (
                <time dateTime={formatISO(item.createdAt)}>
                  {format(item.createdAt, 'yyyy.MM.dd')}
                </time>
              )}
            </li>
          ))
        ) : (
          <li className='center'>공지글이 없습니다.</li>
        )}
      </List>
      <Buttons>
        <button type="button" onClick={handleHideToday}>
          오늘 하루 안보기
        </button>
      </Buttons>
    </LayerPopup>
  )
}

export default React.memo(NoticeModal)