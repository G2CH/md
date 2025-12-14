import { Github, ExternalLink } from 'lucide-react'

interface AboutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const links = [
  { label: 'GitHub 仓库', url: 'https://github.com/doocs/md' },
  { label: 'Gitee 仓库', url: 'https://gitee.com/doocs/md' },
  { label: 'GitCode 仓库', url: 'https://gitcode.com/doocs/md' },
]

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <div 
      className={`fixed inset-0 z-50 ${open ? 'block' : 'hidden'}`}
      onClick={() => onOpenChange(false)}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Dialog */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background rounded-lg shadow-lg p-6"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">关于</h2>
        
        <div className="text-center mb-6">
          <h3 className="text-base font-medium mb-2">一款高度简洁的微信 Markdown 编辑器</h3>
          <p className="text-sm text-muted-foreground mb-4">
            扫码关注公众号 Doocs，原创技术内容第一时间推送！
          </p>
          <img
            className="mx-auto w-2/5"
            src="https://cdn-doocs.oss-cn-shenzhen.aliyuncs.com/gh/doocs/md/images/1648303220922-7e14aefa-816e-44c1-8604-ade709ca1c69.png"
            alt="Doocs Markdown 编辑器"
          />
        </div>
        
        <div className="flex flex-wrap justify-center gap-2">
          {links.map(link => (
            <button
              key={link.url}
              onClick={() => window.open(link.url, '_blank')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              {link.label}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-1 rounded hover:bg-accent"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
