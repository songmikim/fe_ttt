'use client'
import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import useUser from '../hooks/useUser'
import loadable from '@loadable/component'
import styled from 'styled-components'
const AdminHeader = loadable(() => import('../outlines/admin/Header'))
const AdminSide = loadable(() => import('../outlines/admin/Side'))
const AdminSubMenu = loadable(() => import('../outlines/admin/SubMenu'))
const Header = loadable(() => import('../outlines/Header'))
const Footer = loadable(() => import('../outlines/Footer'))

const AdminMain = styled.main`
  display: flex;
  min-height: 850px;
  aside {
    width: 220px;
  }
  section.admin-content {
    flex-grow: 1;
    padding: 30px 50px;
  }
`
function getMainClasses(pathname) {
  const paths = pathname.split('/')
  const data: Array<string> = []
  if (paths.length > 1) data.push(paths[1])
  if (paths.length > 2) data.push(`${paths[1]}-${paths[2]}`)

  return ' ' + data.join(' ')
}

export default function LayoutContainer({ children }) {
  const { isAdmin } = useUser()
  const pathname = usePathname()
  const mainClasses = useMemo(() => getMainClasses(pathname), [pathname])

  return isAdmin && pathname.startsWith('/admin') ? (
    <>
      <AdminHeader />
      <AdminMain>
        <AdminSide />
        <section className="admin-content">
          <AdminSubMenu />
          {children}
        </section>
      </AdminMain>
    </>
  ) : (
    <>
      <Header />
      <main
        suppressHydrationWarning={true}
        className={'main-content' + mainClasses}
      >
        {children}
      </main>
      <Footer />
    </>
  )
}
