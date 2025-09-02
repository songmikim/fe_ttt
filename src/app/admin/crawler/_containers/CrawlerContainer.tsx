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
        const result = await testCrawler(forms[index])
              if (result) {
          alertDialog.success(JSON.stringify(result, null, 2))
        } else {
          alertDialog.error('테스트 실패')
        }
      } catch (err) {
        console.error(err)
        alertDialog.error('테스트 실패')
      }
    },
    [forms],
  )

  const save = useCallback(async () => {
      const requiredFields: Partial<Record<keyof CrawlerConfigType, string>> = {
        url: 'URL을 입력하세요.',
        linkSelector: '링크 선택자를 입력하세요.',
        titleSelector: '제목 선택자를 입력하세요.',
        dateSelector: '날짜 선택자를 입력하세요.',
        contentSelector: '내용 선택자를 입력하세요.',
        urlPrefix: 'URL Prefix를 입력하세요.',
      }

    const newErrors = forms.map(() => ({} as Record<string, string>))
    let hasErrors = false

    forms.forEach((form, idx) => {
      for (const [field, message] of Object.entries(requiredFields)) {
        const value = form[field as keyof CrawlerConfigType]
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          newErrors[idx][field] = message
          hasErrors = true
        }
      }
    })

    if (hasErrors) {
      setErrors(newErrors)
      return
    }

    setErrors(forms.map(() => ({})))

    setSaving(true)
    try {
      await saveCrawlerConfigs(forms)
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
