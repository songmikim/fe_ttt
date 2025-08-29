import React, { useMemo } from 'react'
import loadable from '@loadable/component'
import type { BoardFormType } from '../_types/BoardType'

const DefaultSkin = loadable(() => import('./skins/default/BoardForm'))
const GallerySkin = loadable(() => import('./skins/gallery/BoardForm'))

const BoardForm = (props: BoardFormType) => {
  const { board } = props

  const Skin = useMemo(() => {
    if (!board) return

    const { skin } = board

    switch (skin) {
      case 'gallery':
        return GallerySkin
      default:
        return DefaultSkin
    }
  }, [board])

  return board && <Skin {...props} />
}

export default React.memo(BoardForm)