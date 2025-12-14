import { useState, useRef } from 'react'
import { UploadCloud, Loader2 } from 'lucide-react'
import { useUIStore } from '@/stores/useUIStore'
import { useEditorStore } from '@/stores/useEditorStore'
import { toast } from 'sonner'

const imageHostOptions = [
  { value: 'default', label: '默认 (Base64)' },
  { value: 'github', label: 'GitHub' },
  { value: 'aliOSS', label: '阿里云 OSS' },
  { value: 'txCOS', label: '腾讯云 COS' },
  { value: 'qiniu', label: '七牛云' },
]

export function UploadImgDialog() {
  const { isShowUploadImgDialog, toggleShowUploadImgDialog } = useUIStore()
  const { editor } = useEditorStore()
  
  const [imgHost, setImgHost] = useState('default')
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('图片大小不能超过 10MB')
      return
    }

    setIsUploading(true)

    try {
      // For now, convert to base64
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        insertImage(base64, file.name)
        setIsUploading(false)
        toggleShowUploadImgDialog(false)
        toast.success('图片已插入')
      }
      reader.onerror = () => {
        toast.error('读取图片失败')
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast.error('上传失败')
      setIsUploading(false)
    }
  }

  const insertImage = (url: string, alt: string) => {
    if (!editor) return
    
    const markdown = `![${alt}](${url})`
    const selection = editor.state.selection.main
    editor.dispatch({
      changes: { from: selection.from, to: selection.to, insert: markdown },
    })
    editor.focus()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
    e.target.value = ''
  }

  if (!isShowUploadImgDialog) return null

  return (
    <div 
      className="fixed inset-0 z-50"
      onClick={() => toggleShowUploadImgDialog(false)}
    >
      <div className="absolute inset-0 bg-black/50" />
      
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-lg shadow-lg p-6"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={() => toggleShowUploadImgDialog(false)}
          className="absolute top-4 right-4 p-1 rounded hover:bg-accent"
        >
          ✕
        </button>
        
        <h2 className="text-lg font-semibold mb-4">上传图片</h2>
        
        {/* Image host selector */}
        <div className="mb-4">
          <label className="block text-sm mb-2">图床</label>
          <select 
            value={imgHost}
            onChange={e => setImgHost(e.target.value)}
            className="w-full px-3 py-2 border rounded bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {imageHostOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        
        {/* Upload area */}
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          className={`
            h-48 border-2 border-dashed rounded-lg cursor-pointer
            flex flex-col items-center justify-center gap-3
            transition-colors
            ${isDragging 
              ? 'border-primary bg-primary/10' 
              : 'border-muted-foreground/30 hover:border-primary hover:bg-primary/5'
            }
          `}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">正在上传...</p>
            </>
          ) : (
            <>
              <UploadCloud className="w-12 h-12 text-muted-foreground" />
              <p className="text-sm text-center px-4">
                将图片拖到此处，或 <strong>点击上传</strong>
              </p>
              <p className="text-xs text-muted-foreground">支持 JPG、PNG、GIF，最大 10MB</p>
            </>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {/* Note about image host config */}
        {imgHost !== 'default' && (
          <p className="mt-3 text-xs text-muted-foreground">
            注意：使用第三方图床需要在设置中配置相关参数
          </p>
        )}
      </div>
    </div>
  )
}
