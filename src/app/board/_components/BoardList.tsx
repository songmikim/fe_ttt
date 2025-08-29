import React, { useMemo } from 'react'
import loadable from '@loadable/component'
import type { BoardListType } from '../_types/BoardType'

const DefaultSkin = loadable(() => import('./skins/default/BoardList'))
const GallerySkin = loadable(() => import('./skins/gallery/BoardList'))

const BoardList = (props: BoardListType) => {
  const { board } = props
  const Skin = useMemo(() => {
    const skin = board?.skin
    switch (skin) {
      case 'gallery':
        return GallerySkin
      default:
        return DefaultSkin
    }
  }, [board])
  return board && <Skin {...props} />
}

export default React.memo(BoardList)