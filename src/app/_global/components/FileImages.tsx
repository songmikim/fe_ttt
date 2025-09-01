'use client'
import React, { useState, useCallback } from 'react'
import styled from 'styled-components'
import Image, { StaticImageData } from 'next/image'
import { FaRegWindowClose } from 'react-icons/fa'
import LayerPopup from './LayerPopup'
import useFetchCSR from '../hooks/useFetchCSR'
import useConfirmDialog from '../hooks/useConfirmDialog'
import color from '../styles/color'
const { white } = color

const ImageItems = styled.ul`
  display: flex;
  flex-wrap: wrap;
  li {
    position: relative;
    margin: 3px 0;
    border-radius: 3px;

    .remove {
      position: absolute;
      top: 5px;
      right: 5px;
      cursor: pointer;
      font-size: 1.5rem;
      color: ${white};
    }

    img {
      cursor: pointer;
      display: block;
    }
  }

  li + li {
    margin-left: 5px;
  }
`

type FileType = {
  items: any
  width?: number
  height?: number
  viewOnly?: boolean
  viewOrgImage?: boolean
  callback?: (item: any) => void,
  fallbackImage? : string | StaticImageData // 이미지가 없을때 출력 될 이미지
}

const ImageItem = ({
  item,
  width,
  height,
  callback,
  viewOnly,
  viewOrgImage,
}) => {
  const { seq, fileUrl, thumbBaseUrl, fileName, image } = item
  const [open, setOpen] = useState<boolean>(false)
  const { ready, fetchCSR: doFetchCSR } = useFetchCSR()
  const fetchCSR = useFetchCSR()
  const confirmDialog = useConfirmDialog()
  const onClose = useCallback(() => setOpen(false), [])
  const onShow = useCallback(() => setOpen(true), [])

  const onRemove = useCallback(
    (seq) => {
      confirmDialog({
        text: '정말 삭제하겠습니까?',
        confirmCallback: () => {
          if (!ready) return
          doFetchCSR(`/file/delete/${seq}`, { method: 'DELETE' })
            .then((res) => res.json())
            .then((item) => {
              //  삭제 후 후속처리
              if (typeof callback === 'function') {
                callback(item)
              }
            })
        },
      })
    },
    [fetchCSR, callback, confirmDialog],
  )

  return (
    image && (
      <li>
        {!viewOnly && (
          <FaRegWindowClose className="remove" onClick={() => onRemove(seq)} />
        )}
        <Image
          src={`${thumbBaseUrl}&width=${width}&height=${height}&crop=true`}
          alt={fileName}
          width={width}
          height={height}
          onClick={onShow}
        />
        {viewOrgImage && (
          <LayerPopup width={500} isOpen={open} onClose={onClose}>
            <Image
              className="org-image"
              width={500}
              height={500}
              src={fileUrl}
              alt={fileName}
            />
          </LayerPopup>
        )}
      </li>
    )
  )
}

const FileImages = ({
  items,
  width,
  height,
  callback,
  viewOnly,
  viewOrgImage,
  fallbackImage,
}: FileType) => {
  width = width ?? 100
  height = height ?? 100
  items = Array.isArray(items) ? items : items ? [items] : []
  if (items.length === 0) {
    return fallbackImage ? (
      <ImageItems>
        <li>
          <Image
            src={fallbackImage}
            alt="없는 이미지"
            width={width}
            height={height}
          />
        </li>
      </ImageItems>
    ) : (
      <></>
    )
  }

  return (
    <ImageItems>
      {items.map((item) => (
        <ImageItem
          key={'file-' + item.seq}
          item={item}
          width={width}
          height={height}
          callback={callback}
          viewOnly={viewOnly}
          viewOrgImage={viewOrgImage}
        />
      ))}
    </ImageItems>
  )
}

export default React.memo(FileImages)
