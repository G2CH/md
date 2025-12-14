import { useState, useRef } from 'react'
import { Package, Plus, Pencil, Trash2, Search, FileInput, FileDown } from 'lucide-react'
import { useUIStore } from '@/stores/useUIStore'
import { useEditorStore } from '@/stores/useEditorStore'
import { toast } from 'sonner'

interface Template {
  id: string
  name: string
  description?: string
  content: string
  createdAt: number
  updatedAt: number
}

// Simple localStorage-based template store
const STORAGE_KEY = 'md-templates'

function loadTemplates(): Template[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveTemplates(templates: Template[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates))
}

export function TemplateDialog() {
  const { isShowTemplateDialog, toggleShowTemplateDialog } = useUIStore()
  const { getContent, importContent } = useEditorStore()
  const editorStore = useEditorStore()
  
  const [templates, setTemplates] = useState<Template[]>(loadTemplates)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [isShowForm, setIsShowForm] = useState(false)
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', content: '' })

  const filteredTemplates = templates.filter(t => 
    t.name.includes(searchKeyword) || 
    (t.description && t.description.includes(searchKeyword))
  )

  const updateTemplates = (newTemplates: Template[]) => {
    setTemplates(newTemplates)
    saveTemplates(newTemplates)
  }

  const openCreateForm = () => {
    setFormMode('create')
    setFormData({ name: '', description: '', content: getContent() })
    setIsShowForm(true)
  }

  const openEditForm = (template: Template) => {
    setFormMode('edit')
    setEditingId(template.id)
    setFormData({ name: template.name, description: template.description || '', content: template.content })
    setIsShowForm(true)
  }

  const saveTemplate = () => {
    if (!formData.name.trim()) {
      toast.error('模板名称不能为空')
      return
    }

    if (formMode === 'create') {
      const newTemplate: Template = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        content: formData.content,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      updateTemplates([...templates, newTemplate])
      toast.success('模板创建成功')
    } else if (editingId) {
      updateTemplates(templates.map(t => 
        t.id === editingId 
          ? { ...t, name: formData.name.trim(), description: formData.description.trim() || undefined, content: formData.content, updatedAt: Date.now() }
          : t
      ))
      toast.success('模板更新成功')
    }

    setIsShowForm(false)
  }

  const deleteTemplate = (id: string) => {
    if (window.confirm('确定要删除此模板吗？')) {
      updateTemplates(templates.filter(t => t.id !== id))
      toast.success('模板已删除')
    }
  }

  const applyTemplate = (template: Template) => {
    importContent(template.content)
    toast.success(`已应用模板「${template.name}」`)
    toggleShowTemplateDialog()
  }

  const insertTemplate = (template: Template) => {
    const editor = editorStore.editor
    if (editor) {
      const selection = editor.state.selection.main
      editor.dispatch({
        changes: { from: selection.from, to: selection.to, insert: template.content },
      })
      editor.focus()
    }
    toast.success(`已插入模板「${template.name}」`)
    toggleShowTemplateDialog()
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })
  }

  if (!isShowTemplateDialog) return null

  return (
    <div 
      className="fixed inset-0 z-50"
      onClick={() => { setIsShowForm(false); toggleShowTemplateDialog() }}
    >
      <div className="absolute inset-0 bg-black/50" />
      
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] bg-background rounded-lg shadow-lg flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5" />
            <h2 className="text-lg font-semibold">模板管理</h2>
          </div>
          <p className="text-sm text-muted-foreground">保存和管理您的 Markdown 模板</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {isShowForm ? (
            <div className="space-y-4">
              <h3 className="font-medium">{formMode === 'create' ? '新建模板' : '编辑模板'}</h3>
              <div>
                <label className="block text-sm mb-1">模板名称 *</label>
                <input
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  placeholder="请输入模板名称"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">描述</label>
                <input
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="可选"
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">内容</label>
                <textarea
                  value={formData.content}
                  onChange={e => setFormData(p => ({ ...p, content: e.target.value }))}
                  rows={8}
                  className="w-full px-3 py-2 border rounded font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsShowForm(false)} className="px-4 py-2 text-sm border rounded hover:bg-accent">取消</button>
                <button onClick={saveTemplate} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90">{formMode === 'create' ? '创建' : '保存'}</button>
              </div>
            </div>
          ) : (
            <>
              {/* Search + Create */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={searchKeyword}
                    onChange={e => setSearchKeyword(e.target.value)}
                    placeholder="搜索模板..."
                    className="w-full pl-9 pr-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <button onClick={openCreateForm} className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 flex items-center gap-2">
                  <Plus className="w-4 h-4" /> 新建
                </button>
              </div>

              {/* Template list */}
              {filteredTemplates.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">{searchKeyword ? '未找到匹配的模板' : '暂无模板'}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTemplates.map(template => (
                    <div key={template.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{template.name}</h4>
                          {template.description && <p className="text-sm text-muted-foreground truncate">{template.description}</p>}
                          <p className="text-xs text-muted-foreground mt-1">更新：{formatDate(template.updatedAt)}</p>
                        </div>
                        <div className="flex gap-1">
                          <button onClick={() => applyTemplate(template)} title="应用模板" className="p-2 border rounded hover:bg-accent"><FileInput className="w-4 h-4" /></button>
                          <button onClick={() => insertTemplate(template)} title="插入模板" className="p-2 border rounded hover:bg-accent"><FileDown className="w-4 h-4" /></button>
                          <button onClick={() => openEditForm(template)} title="编辑" className="p-2 border rounded hover:bg-accent"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => deleteTemplate(template.id)} title="删除" className="p-2 border rounded hover:bg-accent text-destructive"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!isShowForm && (
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <p className="text-sm text-muted-foreground">共 {templates.length} 个模板</p>
            <button onClick={toggleShowTemplateDialog} className="px-4 py-2 text-sm border rounded hover:bg-accent">关闭</button>
          </div>
        )}
      </div>
    </div>
  )
}
