import { useState, useEffect, useRef } from 'react'
import { X, Plus, Eye, Download } from 'lucide-react'
import { themeMap, themeOptions } from '@md/shared/configs'
import { useUIStore } from '@/stores/useUIStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { useEditorStore } from '@/stores/useEditorStore'
import { useRenderStore } from '@/stores/useRenderStore'
import { toast } from 'sonner'

interface CssTab {
  name: string
  title: string
  content: string
}

export function CssEditor() {
  const { isShowCssEditor, isMobile, toggleShowCssEditor } = useUIStore()
  const themeStore = useThemeStore()
  const { getContent } = useEditorStore()
  const { render } = useRenderStore()
  
  const [tabs, setTabs] = useState<CssTab[]>([
    { name: 'default', title: '默认方案', content: '' }
  ])
  const [activeTab, setActiveTab] = useState('default')
  const [cssContent, setCssContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  
  // Get current tab content
  useEffect(() => {
    const tab = tabs.find(t => t.name === activeTab)
    if (tab) {
      setCssContent(tab.content)
    }
  }, [activeTab, tabs])

  // Apply CSS changes
  const handleCssChange = (value: string) => {
    setCssContent(value)
    setTabs(prev => prev.map(tab => 
      tab.name === activeTab ? { ...tab, content: value } : tab
    ))
    
    // Apply theme
    themeStore.applyCurrentTheme()
    themeStore.updateCodeTheme()
    const raw = getContent()
    render(raw, {
      isCiteStatus: themeStore.isCiteStatus,
      legend: themeStore.legend,
      isUseIndent: themeStore.isUseIndent,
      isUseJustify: themeStore.isUseJustify,
      isCountStatus: themeStore.isCountStatus,
      isMacCodeBlock: themeStore.isMacCodeBlock,
      isShowLineNumber: themeStore.isShowLineNumber,
    })
  }

  const handleAddTab = () => {
    const newName = `方案${tabs.length + 1}`
    setTabs(prev => [...prev, { name: newName, title: newName, content: '' }])
    setActiveTab(newName)
    toast.success('新建方案成功')
  }

  const handleRemoveTab = (name: string) => {
    if (tabs.length <= 1) {
      toast.warning('至少保留一个方案')
      return
    }
    
    const newTabs = tabs.filter(t => t.name !== name)
    setTabs(newTabs)
    if (activeTab === name) {
      setActiveTab(newTabs[0].name)
    }
    toast.success('删除成功')
  }

  if (!isShowCssEditor) return null

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleShowCssEditor}
        />
      )}
      
      <div 
        className={`
          h-full flex flex-col bg-background overflow-hidden
          ${isMobile 
            ? 'fixed top-0 right-0 w-full h-full z-50 border-l shadow-lg' 
            : 'border-l-2 flex-1 min-w-0'
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
          <h2 className="text-sm font-semibold">自定义 CSS</h2>
          <button 
            onClick={toggleShowCssEditor}
            className="p-1 hover:bg-accent rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b bg-muted/30">
          <div className="flex-1 flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`
                  px-3 py-2 text-sm whitespace-nowrap flex items-center gap-1 border-b-2 transition-colors
                  ${activeTab === tab.name 
                    ? 'border-primary text-foreground bg-background' 
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {tab.title}
                {activeTab === tab.name && tabs.length > 1 && (
                  <X 
                    className="w-3 h-3 hover:bg-destructive/20 rounded cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveTab(tab.name)
                    }}
                  />
                )}
              </button>
            ))}
          </div>
          <button
            onClick={handleAddTab}
            className="p-2 hover:bg-accent flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* CSS Editor */}
        <div className="flex-1 min-h-0 p-2">
          <textarea
            ref={textareaRef}
            value={cssContent}
            onChange={(e) => handleCssChange(e.target.value)}
            placeholder="Your custom CSS here..."
            className="w-full h-full p-3 font-mono text-sm bg-muted/30 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            spellCheck={false}
          />
        </div>

        {/* Actions */}
        <div className="p-2 border-t flex gap-2">
          <button
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm border rounded hover:bg-accent transition-colors"
          >
            <Eye className="w-4 h-4" />
            内置主题
          </button>
          <button
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            导出主题
          </button>
        </div>
      </div>
    </>
  )
}
