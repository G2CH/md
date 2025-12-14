import { useState } from 'react'
import { 
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, 
  MenubarSeparator, MenubarSub, MenubarSubTrigger, MenubarSubContent
} from '@radix-ui/react-menubar'
import { Copy, Palette, Loader2, Github, Info, Heart, FileText } from 'lucide-react'
import { useUIStore } from '@/stores/useUIStore'
import { useThemeStore } from '@/stores/useThemeStore'
import { useEditorStore } from '@/stores/useEditorStore'
import { usePostStore } from '@/stores/usePostStore'
import { useRenderStore } from '@/stores/useRenderStore'
import { downloadFile, processClipboardContent } from '@/utils'
import { toast } from 'sonner'

import { ViewDropdown, InsertDropdown, StyleDropdown, PostInfo } from '@/components/header'
import { AboutDialog, FundDialog } from '@/components/dialogs'

const menuTriggerClass = "px-3 py-1.5 text-sm font-medium rounded hover:bg-accent hover:text-accent-foreground cursor-pointer data-[state=open]:bg-accent data-[state=open]:text-accent-foreground outline-none select-none"
const menuContentClass = "min-w-[220px] bg-popover text-popover-foreground border rounded-md shadow-md p-1 z-50 animate-in fade-in-0 zoom-in-95"
const menuItemClass = "px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer select-none flex items-center"
const kbdClass = "ml-auto text-xs text-muted-foreground"

export function Header() {
  const [isCopying, setIsCopying] = useState(false)
  const [copyMode, setCopyMode] = useState<'txt' | 'md' | 'html'>('txt')
  const [showAbout, setShowAbout] = useState(false)
  const [showFund, setShowFund] = useState(false)
  
  const { isOpenRightSlider, isOpenPostSlider, togglePostSlider, openConfirmDialog } = useUIStore()
  const toggleRightSlider = () => useUIStore.setState(s => ({ isOpenRightSlider: !s.isOpenRightSlider }))

  const { editor, importContent, getContent, formatText, clearContent, formatContent } = useEditorStore()
  const { currentPostId, getPostById, renamePost } = usePostStore()
  const { output } = useRenderStore()
  const { primaryColor } = useThemeStore()
  
  const post = getPostById(currentPostId)
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentPostId) {
      renamePost(currentPostId, e.target.value)
    }
  }

  const handleImportMarkdown = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md'
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0]
      if (!file) return
      const text = await file.text()
      importContent(text)
      toast.success('导入成功')
    }
    input.click()
  }

  const handleExportMarkdown = () => {
    const content = getContent()
    const title = post?.title || 'untitled'
    downloadFile(content, `${title}.md`, 'text/markdown;charset=utf-8')
    toast.success('导出成功')
  }

  const handleCopy = async (mode: 'txt' | 'md' | 'html' = 'txt') => {
    setIsCopying(true)
    setCopyMode(mode)
    
    try {
      if (mode === 'md') {
        const mdContent = getContent()
        await navigator.clipboard.writeText(mdContent)
        toast.success('已复制 Markdown 源码到剪贴板')
        setIsCopying(false)
        return
      }

      await processClipboardContent(primaryColor)
      
      const clipboardDiv = document.getElementById('output')
      if (!clipboardDiv) {
        toast.error('未找到复制区域')
        setIsCopying(false)
        return
      }
      
      const htmlContent = clipboardDiv.innerHTML
      const plainText = clipboardDiv.textContent || ''
      
      if (mode === 'html') {
        await navigator.clipboard.writeText(htmlContent)
        toast.success('已复制 HTML 源码到剪贴板')
      } else {
        if (typeof ClipboardItem !== 'undefined') {
          const clipboardItem = new ClipboardItem({
            'text/html': new Blob([htmlContent], { type: 'text/html' }),
            'text/plain': new Blob([plainText], { type: 'text/plain' }),
          })
          await navigator.clipboard.write([clipboardItem])
        } else {
          await navigator.clipboard.writeText(plainText)
        }
        toast.success('已复制渲染后的内容到剪贴板，可直接到公众号后台粘贴')
      }
    } catch (error) {
      console.error('Copy failed:', error)
      toast.error('复制失败')
    } finally {
      setIsCopying(false)
    }
  }

  const handleFormat = (type: string) => {
    formatText(type)
  }

  return (
    <header className="h-15 border-b flex flex-wrap items-center justify-between px-5 bg-background/95 backdrop-blur z-50 transition-all duration-200">
      {/* Left: Menubar */}
      <div className="hidden md:flex space-x-1">
        <Menubar className="flex border-none shadow-none bg-transparent space-x-1">
          {/* 文件菜单 */}
          <MenubarMenu>
            <MenubarTrigger className={menuTriggerClass}>文件</MenubarTrigger>
            <MenubarContent className={menuContentClass}>
              <MenubarItem onSelect={handleImportMarkdown} className={menuItemClass}>
                导入 Markdown
              </MenubarItem>
              <MenubarItem onSelect={handleExportMarkdown} className={menuItemClass}>
                导出 Markdown
              </MenubarItem>
              <MenubarSeparator className="h-px bg-border my-1" />
              <MenubarItem onSelect={clearContent} className={menuItemClass}>
                清空内容
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          
          {/* 编辑菜单 */}
          <MenubarMenu>
            <MenubarTrigger className={menuTriggerClass}>编辑</MenubarTrigger>
            <MenubarContent className={menuContentClass}>
              <MenubarItem onSelect={() => document.execCommand('undo')} className={`${menuItemClass} justify-between`}>
                撤销 <kbd className={kbdClass}>⌘Z</kbd>
              </MenubarItem>
              <MenubarItem onSelect={() => document.execCommand('redo')} className={`${menuItemClass} justify-between`}>
                重做 <kbd className={kbdClass}>⌘⇧Z</kbd>
              </MenubarItem>
              <MenubarSeparator className="h-px bg-border my-1" />
              <MenubarSub>
                <MenubarSubTrigger className={menuItemClass}>复制</MenubarSubTrigger>
                <MenubarSubContent className={menuContentClass}>
                  <MenubarItem onSelect={() => handleCopy('txt')} className={menuItemClass}>
                    复制到公众号
                  </MenubarItem>
                  <MenubarItem onSelect={() => handleCopy('md')} className={menuItemClass}>
                    复制 Markdown 源码
                  </MenubarItem>
                  <MenubarItem onSelect={() => handleCopy('html')} className={menuItemClass}>
                    复制 HTML 源码
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator className="h-px bg-border my-1" />
              <MenubarItem onSelect={formatContent} className={`${menuItemClass} justify-between`}>
                格式化文档 <kbd className={kbdClass}>⌥⇧F</kbd>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          
          {/* 格式菜单 */}
          <MenubarMenu>
            <MenubarTrigger className={menuTriggerClass}>格式</MenubarTrigger>
            <MenubarContent className={menuContentClass}>
              <MenubarItem onSelect={() => handleFormat('bold')} className={`${menuItemClass} justify-between`}>
                粗体 <kbd className={kbdClass}>⌘B</kbd>
              </MenubarItem>
              <MenubarItem onSelect={() => handleFormat('italic')} className={`${menuItemClass} justify-between`}>
                斜体 <kbd className={kbdClass}>⌘I</kbd>
              </MenubarItem>
              <MenubarItem onSelect={() => handleFormat('strikethrough')} className={menuItemClass}>
                删除线
              </MenubarItem>
              <MenubarSeparator className="h-px bg-border my-1" />
              <MenubarItem onSelect={() => handleFormat('h1')} className={menuItemClass}>
                标题 1
              </MenubarItem>
              <MenubarItem onSelect={() => handleFormat('h2')} className={menuItemClass}>
                标题 2
              </MenubarItem>
              <MenubarItem onSelect={() => handleFormat('h3')} className={menuItemClass}>
                标题 3
              </MenubarItem>
              <MenubarSeparator className="h-px bg-border my-1" />
              <MenubarItem onSelect={() => handleFormat('quote')} className={menuItemClass}>
                引用
              </MenubarItem>
              <MenubarItem onSelect={() => handleFormat('code')} className={menuItemClass}>
                代码块
              </MenubarItem>
              <MenubarItem onSelect={() => handleFormat('link')} className={menuItemClass}>
                链接
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          
          {/* 插入菜单 */}
          <InsertDropdown />
          
          {/* 样式菜单 */}
          <StyleDropdown />
          
          {/* 视图菜单 */}
          <ViewDropdown />
          
          {/* 帮助菜单 */}
          <MenubarMenu>
            <MenubarTrigger className={menuTriggerClass}>帮助</MenubarTrigger>
            <MenubarContent className={menuContentClass}>
              <MenubarItem onSelect={() => setShowAbout(true)} className={menuItemClass}>
                <Info className="mr-2 h-4 w-4" />
                关于
              </MenubarItem>
              <MenubarItem onSelect={() => setShowFund(true)} className={menuItemClass}>
                <Heart className="mr-2 h-4 w-4" />
                赞助
              </MenubarItem>
              <MenubarSeparator className="h-px bg-border my-1" />
              <MenubarItem onSelect={() => window.open('https://github.com/doocs/md', '_blank')} className={menuItemClass}>
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Right: Actions */}
      <div className="flex flex-wrap items-center gap-2">
        {/* 文章列表按钮 */}
        <button 
          onClick={togglePostSlider}
          className={`flex items-center gap-2 h-9 px-3 text-sm font-medium border rounded-md hover:bg-accent transition-colors ${isOpenPostSlider ? 'bg-accent text-accent-foreground' : ''}`}
        >
          <FileText className="w-4 h-4" />
          <span className="hidden sm:inline">文章</span>
        </button>
        
        {/* 复制按钮 */}
        <button 
          onClick={() => handleCopy('txt')}
          disabled={isCopying}
          className="flex items-center gap-2 h-9 px-3 text-sm font-medium border rounded-md hover:bg-accent transition-colors disabled:opacity-50"
        >
          {isCopying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
          <span>复制</span>
        </button>
        
        {/* 文章信息（移动端隐藏） */}
        <div className="hidden md:inline-flex">
          <PostInfo />
        </div>
        
        {/* 样式面板按钮 */}
        <button 
          onClick={toggleRightSlider}
          className={`flex items-center gap-2 h-9 px-3 text-sm font-medium border rounded-md hover:bg-accent transition-colors ${isOpenRightSlider ? 'bg-accent text-accent-foreground' : ''}`}
        >
          <Palette className="w-4 h-4" />
          <span>样式</span>
        </button>
      </div>
      
      {/* Dialogs */}
      <AboutDialog open={showAbout} onOpenChange={setShowAbout} />
      <FundDialog open={showFund} onOpenChange={setShowFund} />
    </header>
  )
}
