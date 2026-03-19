import { useEffect, useRef } from 'react'

export default function AutoTextarea({ value, onChange, placeholder, style, ...props }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
      style={{
        ...style,
        overflow: 'hidden',
        resize: 'none',
      }}
    />
  )
}