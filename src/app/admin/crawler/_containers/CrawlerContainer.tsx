'use client'
import React, { useState, useCallback } from 'react'
import { Button } from '@/app/_global/components/Buttons'
import useConfirmDialog from '@/app/_global/hooks/useConfirmDialog'
import useAlertDialog from '@/app/_global/hooks/useAlertDialog'
import CrawlerConfigForm from '../_components/CrawlerConfigForm'
import type { CrawlerConfigType } from '../_types'
import {
  saveCrawlerConfigs,
  setCrawlerScheduler,
  testCrawler,
} from '../_services/actions'

type Props = {
  initialConfigs: CrawlerConfigType[]
  initialScheduler: boolean
}

const emptyForm: CrawlerConfigType = {
  url: '',
  keywords: '',
  linkSelector: '',
  titleSelector: '',
  dateSelector: '',
  contentSelector: '',
  urlPrefix: '',
}

const CrawlerContainer = ({ initialConfigs, initialScheduler }: Props) => {
  const initialForms = initialConfigs.length ? initialConfigs : [emptyForm]
  const [forms, setForms] = useState<CrawlerConfigType[]>(initialForms)
  const [errors, setErrors] = useState<Record<string, string>[]>(
    initialForms.map(() => ({})),
  )
  const [scheduler, setScheduler] = useState(initialScheduler)
  const [saving, setSaving] = useState(false)
  const confirmDialog = useConfirmDialog()
  const alertDialog = useAlertDialog()

  const onChange = useCallback(
    (
      index: number,
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      const { name, value } = e.target
      setForms((prev) =>
        prev.map((form, i) =>
          i === index ? { ...form, [name]: value } : form,
        ),
      )
      setErrors((prev) => {
        const next = [...prev]
        const formErrors = { ...next[index] }
        delete formErrors[name]
        next[index] = formErrors
        return next
      })
    },
    [],
  )

  const addForm = useCallback(() => {
    setForms((prev) => [...prev, { ...emptyForm }])
    setErrors((prev) => [...prev, {}])
  }, [])

  const removeForm = useCallback(
    (index: number) => {
      confirmDialog({
        text: '정말 삭제하겠습니까?',
        confirmCallback: () => {
          setForms((prev) => prev.filter((_, i) => i !== index))
          setErrors((prev) => prev.filter((_, i) => i !== index))
        },
      })
    },
    [confirmDialog],
  )

  const onTest = useCallback(
    async (index: number) => {
      try {
        const result: any = await testCrawler(forms[index])
        if (Array.isArray(result)) {
          alertDialog.success(JSON.stringify(result, null, 2))
          return
        }

        if (result?.messages) {
          setErrors((prev) => {
            const next = [...prev]
            next[index] = result.messages
            return next
          })
          alertDialog.error(result.messages.global || '테스트 실패')
          return
        }

        alertDialog.error('테스트 실패')
      } catch (err) {
        console.error(err)
        alertDialog.error('테스트 실패')
      }
    },
    [forms, alertDialog],
  )

  const save = useCallback(async () => {
    setErrors(forms.map(() => ({})))

    setSaving(true)
    try {
      const messages = await saveCrawlerConfigs(forms)
      if (messages) {
        const newErrors = forms.map(() => ({} as Record<string, string>))

        Object.entries(messages).forEach(([key, message]) => {
          if (key === 'global') return
          const parts = key.replace(/\[|\]/g, '').split('.')
          if (parts.length === 2) {
            const idx = parseInt(parts[0], 10)
            const field = parts[1]
            if (!isNaN(idx) && newErrors[idx]) {
              newErrors[idx][field] = message as string
            }
          }
        })

        setErrors(newErrors)

        if (messages.global) {
          alertDialog.error(messages.global)
        }

        return
      }

      alertDialog.success('저장되었습니다.')
    } finally {
      setSaving(false)
    }
  }, [forms, alertDialog])

  const toggleScheduler = useCallback(async () => {
    const enabled = !scheduler
    setScheduler(enabled)
    await setCrawlerScheduler(enabled)
  }, [scheduler])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <Button
        type="button"
        onClick={toggleScheduler}
        color={scheduler ? 'danger' : 'primary'}
      >
        {scheduler ? '스케줄러 중지' : '스케줄러 실행'}
      </Button>

      {forms.map((form, index) => (
        <CrawlerConfigForm
          key={index}
          index={index}
          form={form}
          onChange={onChange}
          onRemove={removeForm}
          onTest={onTest}
          errors={errors[index]}
        />
      ))}

      <div>
        <Button type="button" onClick={addForm} color="dark">
          추가
        </Button>
      </div>
      <div>
        <Button type="button" onClick={save} disabled={saving}>
          저장
        </Button>
      </div>
    </div>
  )
}

export default React.memo(CrawlerContainer)
