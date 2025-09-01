'use client'
import React, { useMemo } from 'react'
import type { CommentType } from '../_types/CommentType'
import loadable from '@loadable/component'

const DefaultFormSkin = loadable(() => import('./skins/default/CommentForm'))
const GalleryFormSkin = loadable(() => import('./skins/gallery/CommentForm'))

const DefaultItemsSkin = loadable(() => import('./skins/default/CommentItems'))
const GalleryItemsSkin = loadable(() => import('./skins/gallery/CommentItems'))

const Comment = (props: CommentType & { commentable?: boolean }) => {
  const { board, items, commentable } = props
  const [FormSkin, ItemsSkin] = useMemo<Array<any>>(() => {
    const skin = board?.skin ?? 'default'

    switch (skin) {
      case 'gallery':
        return [GalleryFormSkin, GalleryItemsSkin]
      default:
        return [DefaultFormSkin, DefaultItemsSkin]
    }
  }, [board])
  return (
    <>
      {board?.comment && commentable && <FormSkin {...props} />}
      {items && items.length > 0 && <ItemsSkin items={items} />}
    </>
  )
}

export default React.memo(Comment)