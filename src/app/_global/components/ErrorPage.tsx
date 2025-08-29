'use client'

import React from 'react'
import styled from 'styled-components'
import ContentBox from './ContentBox'
import { Button } from './Buttons'
import fontsize from '../styles/fontsize'
import mainImage from '../assets/images/main.jpg'

interface ErrorPageProps {
  statusCode: number | string
  title: string
  description?: string
}

const Background = styled.div`
  background: url(${mainImage.src}) no-repeat center/cover;
  min-height: 100vh;
`

const Wrapper = styled.div`
  background: rgba(255,255,255,0.7);
  margin-top: 10%;
  text-align: center;
  border-radius: 15px;
  padding: 120px 0;

  a {
    padding: 10px 15px;
  }
`

const StatusCode = styled.h1`
  font-size: 5rem;
  margin: 0 0 20px;
`

const Title = styled.h2`
  font-size: ${fontsize.extra};
  margin: 0 0 20px;
`

const Description = styled.p`
  font-size: ${fontsize.normal};
  margin: 0 0 30px;
`

export default function ErrorPage({
  statusCode,
  title,
  description,
}: ErrorPageProps) {
  return (
    <Background>
      <ContentBox>
        <Wrapper>
          <StatusCode>{statusCode}</StatusCode>
          <Title>{title}</Title>
          {description && <Description>{description}</Description>}
          <Button as="a" href="/" >홈으로 이동</Button>
        </Wrapper>
      </ContentBox>
    </Background>
  )
}
