interface FundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const contributors = [
  {
    name: 'yanglbme',
    imageUrl: 'https://cdn-doocs.oss-cn-shenzhen.aliyuncs.com/gh/doocs/md/images/support1.jpg',
    altText: '赞赏二维码 1',
  },
  {
    name: 'yangfong',
    imageUrl: 'https://cdn-doocs.oss-cn-shenzhen.aliyuncs.com/gh/doocs/md/images/support2.jpg',
    altText: '赞赏二维码 2',
  },
]

export function FundDialog({ open, onOpenChange }: FundDialogProps) {
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
        <h2 className="text-lg font-semibold mb-4">赞赏</h2>
        
        <div className="text-center mb-4">
          <p className="text-sm text-muted-foreground mb-4">
            若觉得项目不错，可以通过以下方式支持我们～
          </p>
          
          <div className="grid grid-cols-2 gap-4 my-5">
            {contributors.map(contributor => (
              <div key={contributor.name} className="text-center">
                <img
                  src={contributor.imageUrl}
                  alt={contributor.altText}
                  className="mx-auto rounded-lg"
                  style={{ width: '90%', maxWidth: '200px' }}
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={() => onOpenChange(false)}
            className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            关闭
          </button>
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
