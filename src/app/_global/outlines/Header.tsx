'use client'
import NoProfileImage from '../assets/images/no_profile.png'
import React, { useState, useRef, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import FileImages from '../components/FileImages'
import { Button } from '../components/Buttons'
import logo from '../assets/images/logo.png'
import useUser from '../hooks/useUser'
import styled from 'styled-components'
import Link from 'next/link'
import Image from 'next/image'
import color from '../styles/color'
import classNames from 'classnames'
const { light } = color

const StyledHeader = styled.header`
  position: relative;
  background: #fefcf8;

  /* ---- main-header S ---- */
  &.main-header {
    position: fixed;
    top: 20px;
    left: 20px;
    right: 20px;

    width: auto;
    max-width: none;

    background: rgba(150, 188, 72, 0.8);
    color: #fff;
    border-radius: 12px;
    z-index: 1000;

    .menu-right .menu-link button,
    .menu-right .mypage-btn button,
    .menu-right .logout-btn button,
    .menu-right .admin-btn button {
      color: #fff;
      background-color: transparent;
    }

    .menu-left .badge {
      color: #fff;
    }

    .menu-link a {
      color: #fff;
      &:hover {
        background-color: #7da53c;
        border-radius: 18px;
        height: 36px;
        color: #fff;
      }
    }
  }
  /* ---- main-header E ---- */

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  height: auto;
  padding: 10px 20px;
  min-width: 820px;

  /* 왼쪽: 로고 + 환영 메시지 */
  .menu-left {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;

    .headerLogo {
      width: 60px;
      height: auto;
      display: block;
    }

    .badge {
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 14px;
      font-weight: 500;
      white-space: nowrap;
    }
  }

  .menu-link a {
    display: flex;
    align-items: center;
    height: 50px;
    min-width: 120px;
    text-align: center;
    justify-content: center;
    font-weight: 500;
    font-size: 14px;
    color: #333;
    text-decoration: none;
    white-space: nowrap;

    &:hover {
      color: #74895f;
    }
  }

  /* 오른쪽: 메뉴 */
  .menu-right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;

    .menu-link button,
    .mypage-btn button,
    .logout-btn button,
    .admin-btn button {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      font-size: 13px;
      background-color: #96bc48;
      color: #fff;
      border-radius: 18px;
      padding: 0 12px;
      gap: 6px;
      white-space: nowrap;
    }

    .menu-link button:hover,
    .mypage-btn button:hover,
    .logout-btn button:hover,
    .admin-btn button:hover {
      background-color: #87aa41;
    }

    .profile-image {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;

    .menu-left {
      flex-direction: column;
      align-items: flex-start;
    }

    .menu-right {
      width: 100%;
      justify-content: flex-start;
      flex-wrap: wrap;
    }

    .menu-link a {
      height: 40px;
      font-size: 13px;
    }
  }
`

const StyledSubMenu = styled.div<{ $isLogin: boolean; $isAdmin: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;

  min-height: 150px;

  background: rgba(255, 248, 204, 0.84);
  color: #fff;
  border-radius: 12px;

  transition: opacity 0.3s ease-in-out;
  pointer-events: none;
  opacity: 0;
  z-index: 10;

  &.open {
    pointer-events: auto;
    opacity: 1;
  }

  .submenu-inner {
    position: relative;
    width: 100%;
    margin: 0;
    padding: ${({ $isLogin, $isAdmin }) =>
      $isAdmin ? '20px 340px' : $isLogin ? '20px 200px' : '20px 155px'};

    display: flex;
    gap: 15px;
    justify-content: flex-end;
  }

  .submenu-inner a {
    color: #333333;
    text-decoration: none;
    font-size: 14px;
  }

  .submenu-group {
    display: flex;
    min-width: 120px;
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .submenu-item {
    flex: 1;
    min-width: 150px;
    font-size: 14px;
    cursor: pointer;
  }
`

const Header = () => {
  const { isLogin, isAdmin, loggedMember } = useUser()
  const [openMenu, setOpenMenu] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const subMenuRef = useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()

  const validPaths = ['/board', '/event', '/mypage', '/recycle', '/member']
  const isMainOrError =
    pathname === '/' || !validPaths.some((path) => pathname.startsWith(path))

  const onMenuOpen = useCallback((menu: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpenMenu(menu)
  }, [])

  const onMenuClose = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpenMenu(null), 200) // 지연 닫기
  }, [])

  return (
    <StyledHeader
      className={classNames({
        'main-header': isMainOrError,
      })}
    >
      <div className="menu-left">
        <div className="headerLogo">
          <Link href="/">
            <Image src={logo} alt="logo" className="headerLogo" />
          </Link>
        </div>
        <span className="badge">
          {loggedMember?.name
            ? `${loggedMember.name} (${loggedMember.email})님 환영합니다.`
            : '게스트님 환영합니다.'}
        </span>
      </div>

      <div className="menu-right">
        {/* 게시판 메뉴 */}
        {['게시판', '환경 행사'].map((label, idx) => (
          <div
            className="menu-link"
            key={idx}
            onMouseEnter={() =>
              onMenuOpen(label === '게시판' ? 'board' : 'event')
            }
            onMouseLeave={onMenuClose}
          >
            <Link href={label === '게시판' ? '/board/list/freetalk' : '/event'}>
              {label}
            </Link>
          </div>
        ))}

        {/* 로그인/회원가입 / 마이페이지 */}
        {isLogin ? (
          <>
            <div
              className="menu-link mypage-btn"
              onMouseEnter={() => onMenuOpen('mypage')}
              onMouseLeave={onMenuClose}
            >
              <Link href="/mypage" prefetch={false}>
                <Button type="button">마이페이지</Button>
              </Link>
            </div>
            <a href="/member/api/logout" className="logout-btn">
              <Button type="button">로그아웃</Button>
            </a>
            {isAdmin && (
              <a href="/admin/board" className="admin-btn">
                <Button type="button">사이트 관리</Button>
              </a>
            )}
            <Link href="/mypage" className="menu-link profile-image">
              <FileImages
                items={loggedMember.profileImage}
                viewOnly={true}
                width={45}
                height={45}
                fallbackImage={NoProfileImage}
              />
            </Link>
          </>
        ) : (
          <>
            <div
              className="menu-link"
              onMouseEnter={() => onMenuOpen('guest')}
              onMouseLeave={onMenuClose}
            >
              <Link href="/member/join" prefetch={false}>
                <Button type="button">회원가입</Button>
              </Link>
            </div>
            <div
              className="menu-link"
              onMouseEnter={() => onMenuOpen('guest')}
              onMouseLeave={onMenuClose}
            >
              <Link href="/member/login" prefetch={false}>
                <Button type="button" color="secondary">
                  로그인
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>

      {/* 드롭다운 영역 */}
      <StyledSubMenu
        $isLogin={isLogin}
        $isAdmin={isAdmin}
        ref={subMenuRef}
        className={openMenu ? 'open' : ''}
        onMouseEnter={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current) // 닫힘 예약 취소
        }}
        onMouseLeave={onMenuClose} // 드롭다운 벗어나면 닫힘
      >
        <div className="submenu-inner">
          {/* 게시판 그룹 */}
          <div className="submenu-group">
            <Link href="/board/list/notice">공지사항</Link>
            <Link href="/board/list/freetalk">자유게시판</Link>
          </div>

          {/* 환경 행사 그룹 */}
          <div className="submenu-group">
            <Link href="/event">환경행사 보기</Link>
          </div>

          {/* 마이페이지 그룹 (로그인시) */}
          {isLogin && (
            <div className="submenu-group">
              <Link href="/mypage">홈</Link>
              <Link href="/mypage/profile">개인정보</Link>
              <Link href="/mypage/recycle">분리수거 결과</Link>
            </div>
          )}

          {/* 게스트 그룹 (로그인 안했을 때) */}
          {!isLogin && (
            <div className="submenu-group">
              <Link href="/member/join">회원가입 하기</Link>
            </div>
          )}
        </div>
      </StyledSubMenu>
    </StyledHeader>
  )
}

export default React.memo(Header)
