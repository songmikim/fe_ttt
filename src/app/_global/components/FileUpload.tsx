'use client'
import React, { useCallback } from 'react'
import { MdFileUpload } from 'react-icons/md'
import { Button } from './Buttons'
import useFetchCSR from '../hooks/useFetchCSR'
import useAlertDialog from '../hooks/useAlertDialog'

type FileType = {
  gid: string | number
  location?: string | number
  single?: boolean
  imageOnly?: boolean
  callback?: (items: Array<any>) => void
}

const FileBox = ({ gid, location, single, imageOnly, callback }: FileType) => {
  const { fetchCSR, ready } = useFetchCSR()
  const alertDialog = useAlertDialog()

  const onUploadClick = useCallback(() => {
    const fileEl = document.createElement('input')
    fileEl.type = 'file'
    fileEl.multiple = single ? false : true
    if (imageOnly) {
      fileEl.accept = 'image/*'
    }
    fileEl.click()
    fileEl.removeEventListener('change', fileUploadHandler)
    fileEl.addEventListener('change', fileUploadHandler)

    /**
     * 파일을 선택하면 업로드 처리
     * @param e
     */
    function fileUploadHandler(e) {
      const files = e.target.files

      // 이미지 형식이 아닌 파일이 있는지 검사
      if (imageOnly) {
        let allImages = true
        for (const file of files) {
          // 이미지가 아닌 파일이 있는 경우
          if (file.type.indexOf('image/') === -1) {
            allImages = false
            break
          }
        }

        if (!allImages) {
          // 검증 실패
          alertDialog({
            text: '이미지 형식 파일만 업로드 하세요.',
          })
          return
        }
      }

      const formData = new FormData()
      formData.append('gid', '' + gid)
      if (location) {
        formData.append('location', '' + location)
      }

      if (single) {
        formData.append('single', 'true')
      }

      if (imageOnly) {
        formData.append('imageOnly', 'true')
      }

      for (const file of files) {
        formData.append('file', file)
      }

      if (!ready) return
      fetchCSR('/file/upload', {
        method: 'POST',
        body: formData,
      })
        .then((res) => res.json())
        .then((items) => {
          if (typeof callback === 'function') {
            callback(items)
          }
        })
    }
  }, [fetchCSR, ready, gid, location, imageOnly, single, callback, alertDialog])

  return (
    <>
      <Button type="button" onClick={onUploadClick} width={150}>
        <MdFileUpload /> 파일 업로드
      </Button>
    </>
  )
}

export default React.memo(FileBox)
