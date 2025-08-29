'use client'
import React, { useState, useCallback } from 'react'
import { Button } from '@/app/_global/components/Buttons'
import useConfirmDialog from '@/app/_global/hooks/useConfirmDialog'
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
  const [forms, setForms] = useState<CrawlerConfigType[]>(
    initialConfigs.length ? initialConfigs : [emptyForm],
  )
  const [scheduler, setScheduler] = useState(initialScheduler)
  const [saving, setSaving] = useState(false)
  const confirmDialog = useConfirmDialog()

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
    },
    [],
  )

  const addForm = useCallback(() => {
    setForms((prev) => [...prev, { ...emptyForm }])
  }, [])

  const removeForm = useCallback(
    (index: number) => {
      confirmDialog({
        text: '정말 삭제하겠습니까?',
        confirmCallback: () => {
          setForms((prev) => prev.filter((_, i) => i !== index))
        },
      })
    },
    [confirmDialog],
  )

  const onTest = useCallback(
    async (index: number) => {
      try {
        const result = await testCrawler(forms[index])
        alert(result ? JSON.stringify(result, null, 2) : '테스트 실패')
      } catch (err) {
        console.error(err)
        alert('테스트 실패')
      }
    },
    [forms],
  )

  const save = useCallback(async () => {
    setSaving(true)
    try {
      await saveCrawlerConfigs(forms)
      alert('저장되었습니다.')
    } finally {
      setSaving(false)
    }
  }, [forms])

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
