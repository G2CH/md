import { useEffect } from 'react'
import { AppLayout } from '@/components/layout/AppLayout'
import { useUIStore } from '@/stores/useUIStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { 
  InsertFormDialog, 
  UploadImgDialog, 
  InsertMpCardDialog, 
  TemplateDialog, 
  EditorStateDialog 
} from '@/components/dialogs'
import { BackTop } from '@/components/ui/BackTop'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { Toaster } from 'sonner'

function App() {
  const { isDark } = useUIStore()
  const { applyCurrentTheme, updateCodeTheme } = useThemeStore()

  // Initialize keyboard shortcuts
  useKeyboardShortcuts()

  // Apply dark mode class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  // Apply theme on mount
  useEffect(() => {
    applyCurrentTheme()
    updateCodeTheme()
  }, [])

  return (
    <>
      <AppLayout />
      <InsertFormDialog />
      <UploadImgDialog />
      <InsertMpCardDialog />
      <TemplateDialog />
      <EditorStateDialog />
      <BackTop target="preview" right={24} bottom={24} />
      <Toaster position="bottom-right" richColors />
    </>
  )
}

export default App



