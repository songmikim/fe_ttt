'use client'
import React, {
  useState,
  useEffect,
  useActionState,
  useCallback,
  useRef,
} from 'react'
import { produce } from 'immer'
import BoardForm from '../_components/BoardForm'
import type { BoardConfigType, BoardDataType } from '../_types/BoardType'
import CommonContainer from '../_wrappers/CommonContainer'
import useUser from '@/app/_global/hooks/useUser'
import { processUpdate } from '../_services/actions'

const UpdateContainer = ({
  board,
  data,
}: {
  board?: BoardConfigType
  data: BoardDataType
}) => {
  const [_data, setData] = useState<BoardDataType>(data)
  const [errors, action, pending] = useActionState<any, any>(processUpdate, {})
  const { isLogin, loggedMember } = useUser()
  const editorRef = useRef<any>(null)
  useEffect(() => {
    if (data.mode === 'write') {
      data.guest = !isLogin

      if (isLogin) {
        data.poster = loggedMember.name
      }

      setData({ ...data })
    }
  }, [data, isLogin, loggedMember?.name])

  const onChange = useCallback((e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const onToggle = useCallback((key, value) => {
    setData((prev) => ({ ...prev, [key]: value }))
  }, [])

  const editorCallback = useCallback((editor) => {
    editorRef.current = editor
  }, [])

  // 파일 업로드 후속처리
  const fileUploadCallback = useCallback((items) => {
    const attachFiles: Array<any> = [],
      editorImages: Array<any> = [],
      imageUrls: Array<string> = []
    items.forEach((item) => {
      const { location } = item
      if (location === 'editor') {
        editorImages.push(item)
        imageUrls.push(item.fileUrl)
      } else {
        attachFiles.push(item)
      }
    })

    setData(
      produce((draft) => {
        if (attachFiles.length > 0) {
          draft?.attachFiles?.push(...attachFiles)
        }

        if (editorImages.length > 0) {
          draft?.editorImages?.push(...editorImages)
        }
      }),
    )

    // 에디터에 첨부할 이미지가 있다면 첨부
    if (editorRef.current && imageUrls.length > 0) {
      editorRef.current.execute('insertImage', { source: imageUrls })
    }
  }, [])

  // 파일 삭제 후속 처리
  const fileDeleteCallback = useCallback(({ seq, location }) => {
    setData(
      produce((draft) => {
        if (draft) {
          const field = location === 'editor' ? 'editorImages' : 'attachFiles'
          const items = draft[field] ?? []
          draft[field] = items.filter((item) => item.seq !== seq)
        }
      }),
    )
  }, [])

  return (
    <CommonContainer board={board} data={data} mode={data.mode ?? ''}>
      <BoardForm
        board={board}
        data={_data}
        errors={errors}
        pending={pending}
        action={action}
        onChange={onChange}
        onToggle={onToggle}
        editorCallback={editorCallback}
        fileUploadCallback={fileUploadCallback}
        fileDeleteCallback={fileDeleteCallback}
      />
    </CommonContainer>
  )
}

export default React.memo(UpdateContainer)