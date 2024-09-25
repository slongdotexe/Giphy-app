import { useEffect, useRef } from 'react'
import { css } from '../../styled-system/css'
import { GiphyApiData } from '../types'
import { GalleryTile } from './Tile'

export interface TendingResultsProps {
  imageResults?: GiphyApiData[]
  hide?: boolean
  fetchNextPage: () => void
}

export const ResultsGrid = ({ imageResults, hide, fetchNextPage }: TendingResultsProps) => {
  const observerElement = useRef<HTMLImageElement>(null)

  /**
   * Create an IntersectionObserver to watch a tile for infinite scrolling
   */
  useEffect(() => {
    if (!observerElement.current) return

    const tileObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio > 0 && observerElement.current) {
            observer.unobserve(observerElement.current)
            fetchNextPage()
            return
          }
        })
      },
      {
        threshold: 0.1,
      },
    )
    const currentElement = observerElement.current
    if (currentElement) {
      tileObserver.observe(currentElement)
    }

    return () => {
      if (currentElement) {
        tileObserver.unobserve(currentElement)
      }
    }
  }, [imageResults])

  return (
    <div
      className={css({
        display: hide ? 'none' : 'flex',
        flexWrap: 'wrap',
        width: '100%',
        height: '100%',
      })}
    >
      {imageResults?.map(({ id, ...restProps }, index) => {
        const isFourthLast = imageResults?.length - 4 === index
        return <GalleryTile ref={isFourthLast ? observerElement : null} gifResult={{ id, ...restProps }} />
      })}
    </div>
  )
}
