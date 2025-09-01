'use client'
import styled from 'styled-components'
import bgImg from '@/app/_global/assets/images/main5.png'
import { Button } from '@/app/_global/components/Buttons'

export const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: url(${bgImg.src}) no-repeat center center fixed;
  background-size: cover;

  display: flex;
  justify-content: center;
  padding: 300px 20px; /* 본문 확보 + 좌우 여백 */
`

export const MainSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
  border-radius: 16px;
  gap: 20px;
`

export const Counter = styled.div`
  font-size: 64px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: bold;
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
`

export const SubText = styled.div`
  font-size: 32px;
  color: rgba(255, 255, 255, 0.85);
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.2);
`

export const StyledButton = styled(Button)`
  font-size: 30px;
  border-radius: 50px;
  width: 240px;
  height: 80px;
  padding: 0;
  font-weight: bold;
  font-family: 'Helvetica Rounded Bold', sans-serif;
  background: linear-gradient(
    to bottom,
    rgba(240, 150, 90, 1),
    rgba(218, 120, 60, 1)
  );
  color: rgba(248, 238, 199, 0.95);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  margin-top: 18px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -75%;
    width: 50%;
    height: 100%;
    background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0.6) 0%,
      rgba(255, 255, 255, 0.1) 60%
    );
    transform: skewX(-25deg);
  }

  &:hover::before {
    left: 125%;
    transition: left 0.7s ease;
  }

  &:hover {
    transform: translateY(-3px);
    background: linear-gradient(
      to bottom,
      rgba(250, 170, 110, 1),
      rgba(230, 140, 80, 1)
    );
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);
  }
`
