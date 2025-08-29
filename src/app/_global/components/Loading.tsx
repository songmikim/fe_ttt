'use client'
import React from 'react'
import styled from 'styled-components'
import { ImSpinner2 } from 'react-icons/im'

const Wrapper = styled.span``

const Loading = ({ loading, text }: { loading: boolean; text?: string }) => {
  return (
    loading && (
      <Wrapper>
        <ImSpinner2 className="spinner" />
        {text && text}
      </Wrapper>
    )
  )
}

export default React.memo(Loading)