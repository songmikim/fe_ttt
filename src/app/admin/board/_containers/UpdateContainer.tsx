'use client'
import React, { useState, useCallback, useActionState } from 'react'
import BoardConfigForm from '../_components/BoardConfigForm'
import { processBoardConfig } from '../_services/actions'
import type { BoardConfigType } from '@/app/board/_types/BoardType'

const UpdateContainer = ({ data }: { data: BoardConfigType }) => {
  const [form, setForm] = useState(data)
  const [errors, action, pending] = useActionState<any, any>(
    processBoardConfig,
    {},
  )

  const onChange = useCallback((e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const onKeyValue = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  return (
    <BoardConfigForm
      form={form}
      onChange={onChange}
      onKeyValue={onKeyValue}
      errors={errors}
      action={action}
      pending={pending}
    />
  )
}

export default React.memo(UpdateContainer)