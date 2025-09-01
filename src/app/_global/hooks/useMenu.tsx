'use client'
import { usePathname } from 'next/navigation'
import menus from '../values/menus'

export default function useMenu() {
  const paths = usePathname().split('/')
  let menuKey = paths.length > 1 ? `/${paths[1]}` : ''
  if (paths.length > 2) menuKey += `/${paths[2]}`

  return menus[menuKey] ?? []
}
