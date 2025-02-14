import { useState, ChangeEvent, useRef, useEffect } from 'react'

export function usePhoneInput(initialValue: string = '+7') {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)

  const formatPhoneNumber = (input: string) => {
    const cleaned = '7' + input.replace(/\D/g, '').slice(1)
    const match = cleaned.match(/^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/)
    if (match) {
      return `+${match[1]}${match[2] ? ` (${match[2]}` : ''}${match[3] ? `) ${match[3]}` : ''}${match[4] ? `-${match[4]}` : ''}${match[5] ? `-${match[5]}` : ''}`
    }
    return input
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    const digitsOnly = inputValue.replace(/\D/g, '')
    
    if (digitsOnly.length <= 11) {
      const formatted = formatPhoneNumber(inputValue)
      setValue(formatted)
    }
  }

  useEffect(() => {
    const input = inputRef.current
    if (input) {
      const handleFocus = () => {
        if (input.value === '+7') {
          input.setSelectionRange(2, 2)
        }
      }
      input.addEventListener('focus', handleFocus)
      return () => {
        input.removeEventListener('focus', handleFocus)
      }
    }
  }, [])

  return {
    value,
    onChange: handleChange,
    formattedValue: value,
    ref: inputRef,
  }
}

