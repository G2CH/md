import { useEffect } from 'react'
import { useEditorStore } from '@/stores/useEditorStore'
import { useUIStore } from '@/stores/useUIStore'
import { toast } from 'sonner'

export function useKeyboardShortcuts() {
  const { formatContent, formatText } = useEditorStore()
  const { toggleDark, toggleShowCssEditor, togglePostSlider } = useUIStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const cmdKey = isMac ? e.metaKey : e.ctrlKey

      // Cmd/Ctrl + B = Bold
      if (cmdKey && e.key === 'b') {
        e.preventDefault()
        formatText('bold')
      }
      
      // Cmd/Ctrl + I = Italic
      if (cmdKey && e.key === 'i') {
        e.preventDefault()
        formatText('italic')
      }
      
      // Cmd/Ctrl + K = Link
      if (cmdKey && e.key === 'k') {
        e.preventDefault()
        formatText('link')
      }
      
      // Alt/Option + Shift + F = Format document
      if (e.altKey && e.shiftKey && e.key === 'f') {
        e.preventDefault()
        formatContent()
        toast.success('文档已格式化')
      }
      
      // Cmd/Ctrl + Shift + D = Toggle dark mode
      if (cmdKey && e.shiftKey && e.key === 'd') {
        e.preventDefault()
        toggleDark()
      }
      
      // Cmd/Ctrl + Shift + C = Toggle CSS editor
      if (cmdKey && e.shiftKey && e.key === 'c') {
        e.preventDefault()
        toggleShowCssEditor()
      }
      
      // Cmd/Ctrl + Shift + E = Toggle post slider
      if (cmdKey && e.shiftKey && e.key === 'e') {
        e.preventDefault()
        togglePostSlider()
      }
      
      // Cmd/Ctrl + 1/2/3 = Headers
      if (cmdKey && ['1', '2', '3'].includes(e.key)) {
        e.preventDefault()
        formatText(`h${e.key}`)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [formatContent, formatText, toggleDark, toggleShowCssEditor, togglePostSlider])
}
