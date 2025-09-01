import React from 'react'
import Modal from 'react-modal'
import styled from 'styled-components'
import { FaRegWindowClose } from 'react-icons/fa'
import fontsize from '../styles/fontsize'
import color from '../styles/color'

const { big } = fontsize
const { dark } = color

Modal.setAppElement('#body')

type LayerPopupType = {
  children: React.ReactNode
  title?: string
  isOpen: boolean
  onClose: () => void
  width?: number
  height?: number
}

const Wrapper = styled.div<{ width?: number; height?: number }>`
  width: ${({ width }) => (width ? width : 300)}px;
  height: ${({ height }) => height && `${height}px`};
  position: relative;

  h2 {
    margin: 0 0 20px;
    padding: 0 10px 12px;
    font-size: ${big};
    border-bottom: 1px solid ${dark};
    text-align: center;
    font-weight: 500;
  }

  .close {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 2.2rem;
    color: ${dark};
    cursor: pointer;
    z-index: 999;
  }
`

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    background: '#fff',
    borderRadius: '25px',
  },
}

const LayerPopup = ({
  children,
  title,
  isOpen,
  onClose,
  width,
  height,
}: LayerPopupType) => {
  return (
    isOpen && (
      <Modal isOpen={isOpen} style={customStyles} ariaHideApp={false}>
        <Wrapper width={width} height={height}>
          <FaRegWindowClose className="close" onClick={onClose} />
          {title && <h2>{title}</h2>}
          {children}
        </Wrapper>
      </Modal>
    )
  )
}

export default React.memo(LayerPopup)
