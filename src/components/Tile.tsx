import { css } from '../../styled-system/css'

import { GiphyApiData } from '../types'
import { forwardRef } from 'react'

interface GalleryTileProps {
  gifResult: GiphyApiData
}

export const GalleryTile = forwardRef(
  (
    {
      gifResult: {
        images: { fixed_width },
      },
    }: GalleryTileProps,
    ref: React.LegacyRef<HTMLImageElement>,
  ) => {
    return (
      <img
        ref={ref}
        className={css({
          width: '50%',
          height: fixed_width.height,
          objectFit: 'contain',
          minHeight: '100px',
          lg: {
            width: '25%',
          },
        })}
        src={fixed_width.url}
      />
    )
  },
)
