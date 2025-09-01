
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { FiDownload } from 'react-icons/fi'
import { FaRegWindowClose } from 'react-icons/fa'
import useFetchCSR from '../hooks/useFetchCSR'
import useConfirmDialog from '../hooks/useConfirmDialog'
import color from '../styles/color'
import fontsize from '../styles/fontsize'
const { light } = color
const { small } = fontsize

type FileType = {
  items: any
  callback?: (item: any) => void
}

const StyledItems = styled.ul`
  li {
    padding: 8px 10px;
    background: ${light};
    font-size: ${small};
    display: flex;

    a {
      flex-grow: 1;
      svg {
        margin-left: 10px;
      }
    }

    .icon-remove {
      cursor: pointer;
    }

    svg {
      vertical-align: middle;
    }
  }

  li + li {
    border-top: 1px solid #ccc;
  }
`

const FileItems = ({ items, callback }: FileType) => {
  const { ready, fetchCSR: doFetchCSR } = useFetchCSR()
  const confirmDialog = useConfirmDialog()
  const onRemove = useCallback(
    (seq) => {
      confirmDialog({
        text: '정말 삭제하겠습니까?',
        confirmCallback: () => {
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
    [doFetchCSR, ready, callback, confirmDialog],
  )

  items = Array.isArray(items) ? items : items ? [items] : []
  if (items.length === 0) return <></>

  return (
    <StyledItems>
      {items.map(({ seq, fileName, fileDownloadUrl }) => (
        <li key={'file-' + seq}>
          <a href={fileDownloadUrl}>
            #{fileName}
            <FiDownload className="icon-download" />
          </a>
          {callback && (
            <FaRegWindowClose
              className="icon-remove"
              onClick={() => onRemove(seq)}
            />
          )}
        </li>
      ))}
    </StyledItems>
  )
}

export default React.memo(FileItems)
