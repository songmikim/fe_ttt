'use client'
import React, { useActionState, useState, useCallback } from 'react'
import PasswordForm from '../_components/PasswordForm'
import { processPassword } from '../_services/actions'
import { useSearchParams } from 'next/navigation'

const PasswordContainer = ({ seq, bid}) => {
  const [errors, action, pending] = useActionState<any, any>(
    processPassword,
    {},
  )
  const [password, setPassword] = useState<string>('')

  const searchParams = useSearchParams()
  const urlMode = searchParams.get('mode')

  const onChange = useCallback((e) => setPassword(e.target.value), [])

  return (
    <PasswordForm
      mode={urlMode}
      seq={seq}
      bid={bid}
      errors={errors}
      action={action}
      pending={pending}
      password={password}
      onChange={onChange}
    />
  )
}

export default React.memo(PasswordContainer)