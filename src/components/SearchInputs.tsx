import { useRef } from 'react'
import { css } from '../../styled-system/css'

export const SearchInput = ({
  onChangeSearch,
  showClear,
  clearSearch,
}: {
  onChangeSearch: React.InputHTMLAttributes<HTMLInputElement>['onChange']
  showClear: boolean
  clearSearch: () => void
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div
      className={css({
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
      })}
    >
      <input
        ref={inputRef}
        onChange={onChangeSearch}
        type="text"
        placeholder="Start typing to search..."
        className={css({
          width: 'full',
          height: '12',
          paddingX: '4',
          backgroundColor: 'gray.600',
          borderRadius: 'md',
          fontSize: 'md',
          fontWeight: 'medium',
          color: 'gray.200',
          caretColor: 'gray.400',
          _placeholder: {
            color: 'gray.400',
            fontSize: 'md',
            fontWeight: 'medium',
          },
          _focus: {
            // Panda CSS wouldn't replace tokens when using short-hand property
            ringColor: 'blue.500',
            ringWidth: 'thin',
            borderColor: 'blue.500',
            borderStyle: 'solid',
            borderWidth: 'thin',
            outline: 'none',
          },
        })}
      />
      {showClear && (
        <button
          className={css({
            position: 'absolute',
            width: '25px',
            height: '25px',
            top: '3',
            right: '2',
            borderRadius: 'full',
            backgroundColor: 'gray.400',
          })}
          onClick={() => {
            clearSearch()
            if (!inputRef.current) return
            inputRef.current.value = ''
          }}
        >
          <span
            className={css({
              fontSize: 'xl',
              lineHeight: 'none',
            })}
          >
            &times;
          </span>
        </button>
      )}
    </div>
  )
}
