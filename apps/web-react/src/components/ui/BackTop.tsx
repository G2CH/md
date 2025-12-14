import { useState, useEffect, useCallback } from 'react'
import { ArrowUpFromLine } from 'lucide-react'

interface BackTopProps {
  target?: string
  visibilityHeight?: number
  right?: number
  bottom?: number
}

export function BackTop({ 
  target, 
  visibilityHeight = 400, 
  right = 16, 
  bottom = 16 
}: BackTopProps) {
  const [visible, setVisible] = useState(false)

  const handleScroll = useCallback(() => {
    let scrollTop = 0
    
    if (target) {
      const el = document.getElementById(target)
      if (el) {
        scrollTop = el.scrollTop
      }
    } else {
      scrollTop = window.scrollY
    }
    
    setVisible(scrollTop > visibilityHeight)
  }, [target, visibilityHeight])

  useEffect(() => {
    const targetEl = target 
      ? document.getElementById(target) 
      : window

    if (!targetEl) return

    // Throttle scroll handler
    let timeout: ReturnType<typeof setTimeout> | null = null
    const throttledScroll = () => {
      if (timeout) return
      timeout = setTimeout(() => {
        handleScroll()
        timeout = null
      }, 200)
    }

    targetEl.addEventListener('scroll', throttledScroll)
    return () => targetEl.removeEventListener('scroll', throttledScroll)
  }, [target, handleScroll])

  const scrollToTop = () => {
    const targetEl = target 
      ? document.getElementById(target) 
      : window

    targetEl?.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }

  if (!visible) return null

  return (
    <button
      onClick={scrollToTop}
      className="fixed z-50 rounded-full w-10 h-10 bg-background border shadow-lg hover:bg-accent flex items-center justify-center transition-all hover:scale-110"
      style={{ right: `${right}px`, bottom: `${bottom}px` }}
      title="回到顶部"
    >
      <ArrowUpFromLine className="w-5 h-5" />
    </button>
  )
}
