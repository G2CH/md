import { create } from 'zustand'
import { EditorView } from '@codemirror/view'
import { formatDoc } from '@/utils'
import { toast } from 'sonner'

interface EditorState {
  editor: EditorView | null
  setEditor: (editor: EditorView | null) => void
  formatContent: () => Promise<string | undefined>
  importContent: (content: string) => void
  clearContent: () => void
  getContent: () => string
  getSelection: () => string
  replaceSelection: (text: string) => void
  insertAtCursor: (text: string) => void
  formatText: (type: string) => void
}

const formatMarkdownPrefixes: Record<string, { prefix?: string; suffix?: string; linePrefix?: string }> = {
  bold: { prefix: '**', suffix: '**' },
  italic: { prefix: '*', suffix: '*' },
  strikethrough: { prefix: '~~', suffix: '~~' },
  code: { prefix: '`', suffix: '`' },
  h1: { linePrefix: '# ' },
  h2: { linePrefix: '## ' },
  h3: { linePrefix: '### ' },
  h4: { linePrefix: '#### ' },
  quote: { linePrefix: '> ' },
  link: { prefix: '[', suffix: '](url)' },
}

export const useEditorStore = create<EditorState>((set, get) => ({
  editor: null,
  setEditor: (editor) => set({ editor }),
  formatContent: async () => {
    const editor = get().editor
    if (!editor) return

    const doc = await formatDoc(editor.state.doc.toString())
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: doc },
    })
    return doc
  },
  importContent: (content) => {
    const editor = get().editor
    if (!editor) return

    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: content },
    })
  },
  clearContent: () => {
    const editor = get().editor
    if (!editor) return

    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: '' },
    })
    toast.success('内容已清空')
  },
  getContent: () => {
    return get().editor?.state.doc.toString() ?? ''
  },
  getSelection: () => {
    const editor = get().editor
    if (!editor) return ''

    const selection = editor.state.selection.main
    return editor.state.doc.sliceString(selection.from, selection.to)
  },
  replaceSelection: (text) => {
    const editor = get().editor
    if (!editor) return

    editor.dispatch(editor.state.replaceSelection(text))
  },
  insertAtCursor: (text) => {
    const editor = get().editor
    if (!editor) return

    const selection = editor.state.selection.main
    editor.dispatch({
      changes: { from: selection.from, to: selection.to, insert: text },
      selection: { anchor: selection.from + text.length },
    })
    editor.focus()
  },
  formatText: (type) => {
    const editor = get().editor
    if (!editor) return

    const format = formatMarkdownPrefixes[type]
    if (!format) return

    const selection = editor.state.selection.main
    const selectedText = editor.state.doc.sliceString(selection.from, selection.to)

    if (format.linePrefix) {
      // Line prefix (headers, quotes)
      const lineStart = editor.state.doc.lineAt(selection.from).from
      editor.dispatch({
        changes: { from: lineStart, to: lineStart, insert: format.linePrefix },
        selection: { anchor: selection.from + format.linePrefix.length },
      })
    } else if (format.prefix && format.suffix) {
      // Wrap with prefix/suffix
      const newText = `${format.prefix}${selectedText || '文本'}${format.suffix}`
      editor.dispatch({
        changes: { from: selection.from, to: selection.to, insert: newText },
        selection: { 
          anchor: selection.from + format.prefix.length,
          head: selection.from + format.prefix.length + (selectedText.length || 2)
        },
      })
    }
    editor.focus()
  },
}))

