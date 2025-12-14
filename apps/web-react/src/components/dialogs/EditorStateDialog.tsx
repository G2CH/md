import { useState, useRef } from 'react'
import { UploadCloud, Download, Settings2 } from 'lucide-react'
import { useUIStore } from '@/stores/useUIStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { usePostStore } from '@/stores/usePostStore'
import { downloadFile } from '@/utils'
import { toast } from 'sonner'

// Store labels for display
const storeLabels: Record<string, string> = {
  isDark: '暗色模式',
  isEditOnLeft: '编辑器在左',
  isOpenRightSlider: '样式面板开启',
  isOpenPostSlider: '文章列表开启',
  theme: '主题',
  fontFamily: '字体',
  fontSize: '字号',
  primaryColor: '主题色',
  codeBlockTheme: '代码块主题',
  legend: '图注格式',
  isMacCodeBlock: 'Mac风格代码块',
  isShowLineNumber: '显示行号',
  posts: '文章列表',
  currentPostId: '当前文章ID',
}

export function EditorStateDialog() {
  const uiStore = useUIStore()
  const themeStore = useThemeStore()
  const postStore = usePostStore()
  
  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import')
  const [importData, setImportData] = useState<Record<string, any> | null>(null)
  const [selected, setSelected] = useState<Record<string, boolean>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Get all store states for export
  const getAllStates = () => ({
    isDark: uiStore.isDark,
    isEditOnLeft: uiStore.isEditOnLeft,
    isOpenRightSlider: uiStore.isOpenRightSlider,
    isOpenPostSlider: uiStore.isOpenPostSlider,
    theme: themeStore.theme,
    fontFamily: themeStore.fontFamily,
    fontSize: themeStore.fontSize,
    primaryColor: themeStore.primaryColor,
    codeBlockTheme: themeStore.codeBlockTheme,
    legend: themeStore.legend,
    isMacCodeBlock: themeStore.isMacCodeBlock,
    isShowLineNumber: themeStore.isShowLineNumber,
    posts: postStore.posts,
    currentPostId: postStore.currentPostId,
  })

  const exportStates = getAllStates()
  const [exportSelected, setExportSelected] = useState<Record<string, boolean>>(
    Object.keys(exportStates).reduce((acc, key) => ({ ...acc, [key]: true }), {})
  )

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        setImportData(data)
        setSelected(Object.keys(data).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
        toast.success('配置文件导入成功')
      } catch {
        toast.error('文件解析失败，请检查JSON格式')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const applyImport = () => {
    if (!importData) return

    Object.keys(selected).forEach(key => {
      if (!selected[key] || importData[key] === undefined) return

      const value = importData[key]

      // Apply to correct store
      if (['isDark', 'isEditOnLeft', 'isOpenRightSlider', 'isOpenPostSlider'].includes(key)) {
        useUIStore.setState({ [key]: value })
      } else if (['theme', 'fontFamily', 'fontSize', 'primaryColor', 'codeBlockTheme', 'legend', 'isMacCodeBlock', 'isShowLineNumber'].includes(key)) {
        useThemeStore.setState({ [key]: value })
      } else if (['posts', 'currentPostId'].includes(key)) {
        usePostStore.setState({ [key]: value })
      }
    })

    toast.success('配置应用成功')
    uiStore.openConfirmDialog(false)
  }

  const exportConfig = () => {
    const selectedStates = Object.keys(exportStates).reduce((acc, key) => {
      if (exportSelected[key]) {
        acc[key] = exportStates[key as keyof typeof exportStates]
      }
      return acc
    }, {} as Record<string, any>)

    downloadFile(JSON.stringify(selectedStates, null, 2), 'md-config.json', 'application/json')
    toast.success('配置文件导出成功')
  }

  if (!uiStore.isOpenConfirmDialog) return null

  return (
    <div 
      className="fixed inset-0 z-50"
      onClick={() => uiStore.openConfirmDialog(false)}
    >
      <div className="absolute inset-0 bg-black/50" />
      
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] bg-background rounded-lg shadow-lg flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-2 mb-1">
            <Settings2 className="w-5 h-5" />
            <h2 className="text-lg font-semibold">导入/导出配置</h2>
          </div>
          <p className="text-sm text-muted-foreground">导入的配置将覆盖当前项目的配置</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'import' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            导入配置
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'export' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            导出配置
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {activeTab === 'import' ? (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Import file area */}
              <div>
                {!importData ? (
                  <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50">
                    <UploadCloud className="w-12 h-12 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">点击选择 JSON 文件</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      className="hidden"
                      onChange={handleFileImport}
                    />
                  </label>
                ) : (
                  <div className="h-48 overflow-auto border rounded-lg bg-muted/30 p-3">
                    <pre className="text-xs">{JSON.stringify(
                      Object.keys(importData).filter(k => selected[k]).reduce((a, k) => ({ ...a, [k]: importData[k] }), {}),
                      null, 2
                    )}</pre>
                  </div>
                )}
              </div>
              
              {/* Selection */}
              <div>
                {importData ? (
                  <ul className="space-y-2 max-h-48 overflow-auto">
                    {Object.keys(importData).map(key => (
                      <li key={key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selected[key] || false}
                          onChange={e => setSelected(p => ({ ...p, [key]: e.target.checked }))}
                          className="rounded"
                        />
                        <label className="text-sm">{storeLabels[key] || key}</label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="h-48 flex items-center justify-center text-muted-foreground">
                    请先导入 JSON 文件
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {/* Selection */}
              <ul className="space-y-2 max-h-64 overflow-auto">
                {Object.keys(exportStates).map(key => (
                  <li key={key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={exportSelected[key] || false}
                      onChange={e => setExportSelected(p => ({ ...p, [key]: e.target.checked }))}
                      className="rounded"
                    />
                    <label className="text-sm">{storeLabels[key] || key}</label>
                  </li>
                ))}
              </ul>
              
              {/* Preview */}
              <div className="h-64 overflow-auto border rounded-lg bg-muted/30 p-3">
                <pre className="text-xs">{JSON.stringify(
                  Object.keys(exportStates).filter(k => exportSelected[k]).reduce((a, k) => ({ ...a, [k]: exportStates[k as keyof typeof exportStates] }), {}),
                  null, 2
                )}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex justify-end gap-2">
          {activeTab === 'import' ? (
            <>
              <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 text-sm border rounded hover:bg-accent">重新导入</button>
              <button onClick={applyImport} disabled={!importData} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50">应用配置</button>
            </>
          ) : (
            <button onClick={exportConfig} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 flex items-center gap-2">
              <Download className="w-4 h-4" />
              导出配置
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
