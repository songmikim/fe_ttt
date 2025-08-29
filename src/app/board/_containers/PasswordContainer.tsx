'use client'
import React, { useActionState, useState, useCallback } from 'react'
import PasswordForm from '../_components/PasswordForm'
import { processPassword } from '../_services/actions'

const PasswordContainer = ({ mode, seq }) => {
  const [errors, action, pending] = useActionState<any, any>(
    processPassword,
    {},
  )
  const [password, setPassword] = useState<string>('')

  const onChange = useCallback((e) => setPassword(e.target.value), [])

  return (
    <PasswordForm
      mode={mode}
      seq={seq}
      errors={errors}
      action={action}
      pending={pending}
      password={password}
      onChange={onChange}
    />
  )
}

export default React.memo(PasswordContainer)