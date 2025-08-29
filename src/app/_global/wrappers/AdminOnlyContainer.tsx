'use client'
import { forbidden } from 'next/navigation'
import useUser from '../hooks/useUser'

export default function AdminOnlyContainer({ children }) {
  const { isAdmin } = useUser()
  if (!isAdmin) {
    forbidden()
  }

  return children
}
