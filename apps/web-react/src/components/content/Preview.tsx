import { useRef, useEffect } from 'react'
import { useRenderStore } from '@/stores/useRenderStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { highlightPendingBlocks, hljs } from '@md/core'
import { FloatingToc } from './FloatingToc'

export function Preview() {
  const { output } = useRenderStore()
  const { previewWidth } = useThemeStore()
  const previewRef = useRef<HTMLDivElement>(null)

  // Highlight code blocks when output changes
  useEffect(() => {
    const outputElement = document.getElementById('output')
    if (outputElement) {
      highlightPendingBlocks(hljs, outputElement)
    }
  }, [output])

  // Scroll sync: when preview scrolls, sync editor
  const handleScroll = () => {
    const source = previewRef.current
    const target = document.querySelector('.cm-scroller') as HTMLElement
    if (!source || !target) return
    
    const sourceHeight = source.scrollHeight - source.clientHeight
    const targetHeight = target.scrollHeight - target.clientHeight
    if (sourceHeight <= 0 || targetHeight <= 0) return
    
    const percentage = source.scrollTop / sourceHeight
    target.scrollTo(0, percentage * targetHeight)
  }

  return (
    <div 
      ref={previewRef}
      id="preview"
      className="preview-wrapper w-full p-5 flex justify-center overflow-y-auto h-full relative"
      onScroll={handleScroll}
    >
      <FloatingToc />
      <div 
        id="output-wrapper"
        className="w-full max-w-full relative"
      >
        <div 
          className={`preview border-x shadow-xl mx-auto ${previewWidth}`}
        >
          <section 
            id="output" 
            className="w-full"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>
      </div>
    </div>
  )
}
