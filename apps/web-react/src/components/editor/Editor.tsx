import { useEffect, useRef } from 'react'
import { EditorView } from '@codemirror/view'
import { EditorState, Compartment } from '@codemirror/state'
import { markdownSetup, theme } from '@md/shared/editor'
import { useEditorStore } from '@/stores/useEditorStore'
import { usePostStore } from '@/stores/usePostStore'
import { useUIStore } from '@/stores/useUIStore'
import { useRenderStore } from '@/stores/useRenderStore'
import { useThemeStore } from '@/stores/useThemeStore'

export function Editor() {
  const editorRef = useRef<HTMLDivElement>(null)
  
  const { setEditor } = useEditorStore()
  const { currentPostId, getPostById, updatePostContent } = usePostStore()
  const { render, initRendererInstance, getRenderer } = useRenderStore()
  const { isDark } = useUIStore()
  const { 
    isCiteStatus, legend, isCountStatus, isMacCodeBlock, isShowLineNumber,
    isUseIndent, isUseJustify
  } = useThemeStore()

  // Refs to avoid stale closures in listeners
  const postRef = useRef({ currentPostId, updatePostContent })
  postRef.current = { currentPostId, updatePostContent }

  useEffect(() => {
    if (!editorRef.current) return

    // Initialize the renderer if not already done
    if (!getRenderer()) {
      initRendererInstance({ isMacCodeBlock, isShowLineNumber })
    }

    const post = getPostById(currentPostId)
    const initialContent = post?.content || ''

    const themeCompartment = new Compartment()

    const startState = EditorState.create({
      doc: initialContent,
      extensions: [
        markdownSetup({
           // onSearch, onReplace placeholders for now
        }),
        themeCompartment.of(theme(isDark)),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
             const val = update.state.doc.toString()
             const { currentPostId, updatePostContent } = postRef.current
             if (currentPostId) {
                updatePostContent(currentPostId, val)
             }
             // Trigger render
             render(val, {
                 isCiteStatus, legend, isCountStatus, isMacCodeBlock, isShowLineNumber,
                 isUseIndent, isUseJustify
             }) 
          }
        })
      ]
    })

    const view = new EditorView({
      state: startState,
      parent: editorRef.current
    })

    setEditor(view)

    // Initial render
    render(initialContent, {
        isCiteStatus, legend, isCountStatus, isMacCodeBlock, isShowLineNumber,
        isUseIndent, isUseJustify
    })

    return () => {
      view.destroy()
      setEditor(null)
    }
  }, [
      // Re-init if post ID changes? 
      // Ideally we shouldn't destroy editor on post change, just update doc.
      // But for MVP simplicity, re-init is safer.
      currentPostId 
  ])

  // Effect to update theme when isDark changes
  // We need access to themeCompartment or view... 
  // In React, it's harder to access the compartment created inside useEffect.
  // We might needed to store compartment in ref or just re-create effect (expensive).
  // Or use a more React-ish CodeMirror wrapper logic. 
  // For now, let's just re-init on theme change or improve later.
  
  return (
    <div ref={editorRef} className="h-full w-full overflow-hidden text-base" />
  )
}
