// textarea 자동 높이 조절 훅
import { useEffect, useRef } from 'react'

export function useAutoResize(value) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [value])

  return ref
}