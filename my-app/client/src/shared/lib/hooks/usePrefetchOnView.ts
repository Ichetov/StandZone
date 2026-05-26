import { useEffect, useRef } from 'react'

type Options = {
  enabled?: boolean
  rootMargin?: string
  onView: () => void
}

export const usePrefetchOnView = ({
  enabled = true,
  rootMargin = '200px',
  onView,
}: Options) => {
  const ref = useRef<HTMLElement | null>(null)
  const hasViewed = useRef(false)

  useEffect(() => {
    if (!enabled) return
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        if (hasViewed.current) return

        hasViewed.current = true
        onView()
        observer.disconnect()
      },
      {
        root: null,
        rootMargin,
        threshold: 0.1,
      }
    )

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [enabled, rootMargin, onView])

  return ref
}