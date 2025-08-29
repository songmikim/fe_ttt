'use client'
import React, { useRef } from 'react'
import { CKEditor } from '@ckeditor/ckeditor5-react'
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  FontFamily,
  Heading,
  FontColor,
  FontBackgroundColor,
  Strikethrough,
  Code,
  Link,
  BlockQuote,
  ViewElement,
  ImageInsert,
  Image,
} from 'ckeditor5'
import 'ckeditor5/ckeditor5.css'

const Editor = ({
  data,
  height,
  callback,
  fieldName,
  onChange,
}: {
  data?: any
  height?: number
  callback?: (editor) => void
  onChange?: (e) => void
  fieldName?: string
}) => {
  const editorRef = useRef<any>(null)
  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        licenseKey: 'GPL',
        plugins: [
          Essentials,
          Paragraph,
          Bold,
          Italic,
          FontFamily,
          Heading,
          FontColor,
          FontBackgroundColor,
          Strikethrough,
          Code,
          Link,
          BlockQuote,
          ImageInsert,
          Image,
        ],
        toolbar: {
          items: [
            'undo',
            'redo',
            '|',
            'heading',
            '|',
            'fontfamily',
            'fontsize',
            'fontColor',
            'fontBackgroundColor',
            '|',
            'bold',
            'italic',
            'strikethrough',
            'subscript',
            'superscript',
            'code',
            '|',
            'link',
            'blockQuote',
            'codeBlock',
            '|',
            'bulletedList',
            'numberedList',
            'todoList',
            'outdent',
            'indent',
          ],
          shouldNotGroupWhenFull: false,
        },
      }}
      data={data ?? ''}
      onReady={(editor) => {
        editor.editing.view.change((writer) => {
          writer.setStyle(
            'height',
            `${height ?? 150}px`,
            editor.editing.view.document.getRoot() as ViewElement,
          )
        })

        editorRef.current = editor

        if (typeof callback === 'function') {
          callback(editor)
        }
      }}
      onChange={() => {
        const e = {
          target: {
            name: fieldName ?? 'content',
            value: editorRef?.current.getData(),
          },
        }
        if (typeof onChange === 'function') {
          onChange(e)
        }
      }}
    />
  )
}

export default React.memo(Editor)