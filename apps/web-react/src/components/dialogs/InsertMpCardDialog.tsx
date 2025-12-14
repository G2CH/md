import { useState } from 'react'
import { useUIStore } from '@/stores/useUIStore'
import { useEditorStore } from '@/stores/useEditorStore'
import { toast } from 'sonner'

interface MpConfig {
  id: string
  name: string
  logo: string
  desc: string
  serviceType: '1' | '2'
  verify: '0' | '1' | '2'
}

function buildMpHtml(config: MpConfig): string {
  const logo = config.logo || 'https://cdn-doocs.oss-cn-shenzhen.aliyuncs.com/gh/doocs/md/images/mp-logo.png'
  const attrs = [
    `data-pluginname="mpprofile"`,
    `data-id="${config.id}"`,
    `data-nickname="${config.name}"`,
    `data-headimg="${logo}"`,
    config.desc && `data-signature="${config.desc}"`,
    `data-service_type="${config.serviceType || '1'}"`,
    `data-verify_status="${config.verify || '0'}"`,
  ].filter(Boolean).join(' ')

  return `<section class="mp_profile_iframe_wrp custom_select_card_wrp" nodeleaf="">
  <mp-common-profile class="mpprofile js_uneditable custom_select_card mp_profile_iframe" ${attrs}></mp-common-profile>
  <br class="ProseMirror-trailingBreak">
</section>`
}

export function InsertMpCardDialog() {
  const { isShowInsertMpCardDialog, toggleShowInsertMpCardDialog } = useUIStore()
  const { editor } = useEditorStore()
  
  const [config, setConfig] = useState<MpConfig>({
    id: '',
    name: '',
    logo: '',
    desc: '',
    serviceType: '1',
    verify: '0',
  })

  const handleChange = (field: keyof MpConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!config.id.trim()) {
      toast.error('公众号 ID 不能为空')
      return
    }
    if (!config.name.trim()) {
      toast.error('公众号名称不能为空')
      return
    }

    const html = buildMpHtml(config)
    
    if (editor) {
      const selection = editor.state.selection.main
      editor.dispatch({
        changes: { from: selection.from, to: selection.to, insert: `\n${html}\n` },
      })
      editor.focus()
    }
    
    toast.success('公众号名片插入成功')
    toggleShowInsertMpCardDialog()
  }

  if (!isShowInsertMpCardDialog) return null

  return (
    <div 
      className="fixed inset-0 z-50"
      onClick={toggleShowInsertMpCardDialog}
    >
      <div className="absolute inset-0 bg-black/50" />
      
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-lg shadow-lg p-6"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={toggleShowInsertMpCardDialog}
          className="absolute top-4 right-4 p-1 rounded hover:bg-accent"
        >
          ✕
        </button>
        
        <h2 className="text-lg font-semibold mb-4">插入公众号名片</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">
              公众号 ID <span className="text-destructive">*</span>
            </label>
            <input
              value={config.id}
              onChange={e => handleChange('id', e.target.value)}
              placeholder="例：MzIxNjA5ODQ0OQ=="
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">
              公众号名称 <span className="text-destructive">*</span>
            </label>
            <input
              value={config.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="例：Doocs"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">公众号 Logo</label>
            <input
              value={config.logo}
              onChange={e => handleChange('logo', e.target.value)}
              placeholder="例：https://doocs.com/mp-logo.png"
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-1">公众号描述</label>
            <textarea
              value={config.desc}
              onChange={e => handleChange('desc', e.target.value)}
              placeholder="公众号简介..."
              rows={2}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">类型</label>
              <select
                value={config.serviceType}
                onChange={e => handleChange('serviceType', e.target.value as '1' | '2')}
                className="w-full px-3 py-2 border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="1">公众号</option>
                <option value="2">服务号</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">认证</label>
              <select
                value={config.verify}
                onChange={e => handleChange('verify', e.target.value as '0' | '1' | '2')}
                className="w-full px-3 py-2 border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="0">无认证</option>
                <option value="1">个人认证</option>
                <option value="2">企业认证</option>
              </select>
            </div>
          </div>
          
          <a
            href="https://github.com/doocs/md/blob/main/docs/mp-card.md"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-primary hover:underline"
          >
            如何获取公众号 ID？
          </a>
          
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={toggleShowInsertMpCardDialog}
              className="px-4 py-2 text-sm border rounded hover:bg-accent transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
            >
              确认
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
