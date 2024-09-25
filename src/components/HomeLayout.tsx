import { useEffect, useRef, useState } from 'react'
import { GiphyApiData } from '../types'
import { box } from '../../styled-system/patterns'
import { css } from '../../styled-system/css'
import { ResultsGrid } from './ResultsGrid'
import { SearchInput } from './SearchInputs'

const endpoint = 'https://api.giphy.com/v1/gifs'
const trendingEndpoint = `${endpoint}/trending`
const searchEndpoint = `${endpoint}/search`
const apiKey = 'UdHd7NDGote2WzHtFBkz22E6cqI5xA12'

interface GiphyApiResponse {
  data?: GiphyApiData[]
  pagination?: { count: number; offset: number; total_count: number }
  error?: string
}
/**
 * Handles data submission and state for a search to the Giphy API with pagination and debouncing.
 * Call `fetchNextResults` to fetch next page of results.
 */
const useSubmitSearch = () => {
  const timerRef = useRef<number | null>(null)
  const fieldStateRef = useRef('')
  const [searchResults, setSearchResults] = useState<GiphyApiResponse | null>(null)

  const submitGiphySearch = async () => {
    const defaultCount = 50
    const currentOffset = searchResults?.pagination?.offset ?? 0
    const offset = currentOffset + (searchResults?.pagination?.count ?? 0)
    const totalCount = searchResults?.pagination?.total_count ?? 0

    const response = await fetch(
      `${searchEndpoint}?${new URLSearchParams({
        api_key: apiKey,
        q: fieldStateRef.current,
        offset: offset.toString(),
        count: (totalCount <= defaultCount ? defaultCount - totalCount : defaultCount).toString(),
      }).toString()}`,
    )

    if (!response.ok) {
      setSearchResults({
        error: "Something unexpected has happened, we'll get it fixed ASAP.",
        data: [],
      })
    }

    const bodyData = await response.json()

    if (bodyData.data.length === 0) {
      setSearchResults({
        error: 'No results found, try a different search',
        data: [],
      })
      return
    }

    setSearchResults((old) => {
      if (!old?.data) {
        return {
          pagination: bodyData.pagination,
          data: [...bodyData.data],
        }
      }
      return {
        pagination: bodyData.pagination,
        data: [...old.data, ...bodyData.data],
      }
    })
  }

  const onChangeSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fieldValue = event.target.value
    fieldStateRef.current = fieldValue
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    if (fieldValue.length === 0) {
      setSearchResults(null)
      timerRef.current = null
      return
    }
    timerRef.current = setTimeout(submitGiphySearch, 1000)
  }

  const clearSearch = () => {
    setSearchResults(null)
    fieldStateRef.current = ''
    timerRef.current = null
    return
  }

  return {
    fieldStateRef,
    searchResults,
    onChangeSearch,
    fetchNextResults: submitGiphySearch,
    clearSearch,
  }
}

/**
 * Handles fetch logic and state for fetching trending GIFs from GIPHY.
 * Call `fetchNextTrendingGifs` to fetch the next page of results.
 */
const useFetchTrendingGifs = () => {
  const [trendingGifs, setTrendingGifs] = useState<GiphyApiResponse | null>(null)

  const fetchTrendingGifs = async () => {
    const offset = (trendingGifs?.pagination?.offset ?? 0) + (trendingGifs?.pagination?.count ?? 0)

    const queryEndpoint = `${trendingEndpoint}?${new URLSearchParams({
      api_key: apiKey,
      offset: offset.toString(),
    }).toString()}`

    const response = await fetch(queryEndpoint)
    const responseBody = await response.json()

    if (!response.ok) {
      setTrendingGifs({
        error: "An unexpected error occurred. We'll get it fixed soon",
        data: [],
      })
      return
    }

    setTrendingGifs((old) => {
      if (!old?.data) {
        return {
          pagination: responseBody.pagination,
          data: [...responseBody.data],
        }
      }
      return {
        pagination: responseBody.pagination,
        data: [...old.data, ...responseBody.data],
      }
    })
  }

  useEffect(() => {
    fetchTrendingGifs()
  }, [])

  return {
    trendingGifs,
    fetchNextTrendingGifs: fetchTrendingGifs,
  }
}

const QueryError = ({ error }: { error: string }) => {
  return (
    <div
      className={css({
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      })}
    >
      <p
        className={css({
          fontSize: 'md',
          fontWeight: 'bold',
          lineHeight: 'loose',
          color: 'gray.300',
        })}
      >
        {error}
      </p>
    </div>
  )
}

export const HomeLayout = () => {
  const { fetchNextTrendingGifs, trendingGifs } = useFetchTrendingGifs()
  const { fetchNextResults, onChangeSearch, searchResults, clearSearch } = useSubmitSearch()

  return (
    <div
      className={box({
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      })}
    >
      <div
        className={box({
          display: 'flex',
          flexDirection: 'column',
          gap: '4',
          width: '100%',
          height: '100%',
          minHeight: '100vh',
          padding: '2',
          maxWidth: 'breakpoint-xl',
        })}
      >
        <h1
          className={css({
            fontSize: '2xl',
            fontWeight: 'bold',
            lineHeight: 'loose',
            color: 'gray.300',
          })}
        >
          Giphy App
        </h1>
        <SearchInput
          onChangeSearch={onChangeSearch}
          clearSearch={clearSearch}
          showClear={!!((searchResults?.data?.length ?? 0) > 0 || searchResults?.error)}
        />
        {searchResults && (
          <>
            {searchResults?.error ? (
              <QueryError error={searchResults?.error} />
            ) : (
              <ResultsGrid fetchNextPage={fetchNextResults} imageResults={searchResults?.data} />
            )}
          </>
        )}
        {trendingGifs && (
          <>
            {trendingGifs?.error ? (
              <QueryError error={trendingGifs?.error} />
            ) : (
              <ResultsGrid
                fetchNextPage={fetchNextTrendingGifs}
                hide={!!searchResults?.data}
                imageResults={trendingGifs?.data}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
