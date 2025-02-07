import { useEffect, useRef, useState } from 'react'

type StickyPosition = 'top' | 'bottom'

/**
 * Returns a ref and a stateful value indicating if the element is sticky at the top or bottom.
 * @param position - 'top' or 'bottom' to specify where to detect stickiness.
 */
export function useSticky<T extends HTMLElement>(
  position: StickyPosition = 'top'
) {
  const stickyRef = useRef<T>(null)
  const [sticky, setSticky] = useState(false)

  useEffect(() => {
    function observe() {
      if (!stickyRef.current) return

      const rect = stickyRef.current.getBoundingClientRect()
      const computedStyle = getComputedStyle(stickyRef.current)
      const offset = parseInt(computedStyle[position]) || 0

      let stickyActive = false

      if (position === 'top') {
        stickyActive = rect.top <= offset
      } else if (position === 'bottom') {
        stickyActive = rect.bottom >= window.innerHeight - offset
      }

      if (stickyActive && !sticky) setSticky(true)
      else if (!stickyActive && sticky) setSticky(false)
    }

    observe()

    document.addEventListener('scroll', observe)
    window.addEventListener('resize', observe)
    window.addEventListener('orientationchange', observe)

    return () => {
      document.removeEventListener('scroll', observe)
      window.removeEventListener('resize', observe)
      window.removeEventListener('orientationchange', observe)
    }
  }, [sticky, position])

  return [stickyRef, sticky] as const
}
