import { useState } from 'react'
import { Plus, Trash2, FileText, ChevronRight } from 'lucide-react'
import { usePostStore } from '@/stores/usePostStore'
import { cn } from '@/lib/utils'

export function Sidebar() {
  const { posts, currentPostId, setCurrentPostId, addPost, delPost } = usePostStore()
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const handleNewPost = () => {
    addPost('新文章')
  }

  const handleDeletePost = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (posts.length <= 1) return // Keep at least one post
    delPost(id)
  }

  const handleSelectPost = (id: string) => {
    setCurrentPostId(id)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="h-full flex flex-col bg-muted/30">
      {/* Header */}
      <div className="p-3 border-b flex items-center justify-between">
        <span className="font-medium text-sm text-muted-foreground">文章列表</span>
        <button 
          onClick={handleNewPost}
          className="p-1.5 hover:bg-accent rounded-md transition-colors"
          title="新建文章"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Post List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {posts.map(post => (
          <div 
            key={post.id} 
            onClick={() => handleSelectPost(post.id)}
            onMouseEnter={() => setHoveredId(post.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={cn(
              "group relative p-2.5 rounded-md cursor-pointer transition-all",
              "hover:bg-accent/50",
              currentPostId === post.id && "bg-accent text-accent-foreground"
            )}
          >
            <div className="flex items-start gap-2">
              <FileText className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{post.title || '无标题'}</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {formatDate(post.updateDatetime)}
                </div>
              </div>
            </div>
            
            {/* Delete button - show on hover */}
            {(hoveredId === post.id || currentPostId === post.id) && posts.length > 1 && (
              <button
                onClick={(e) => handleDeletePost(e, post.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-destructive/10 hover:text-destructive rounded transition-colors"
                title="删除文章"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t text-xs text-muted-foreground text-center">
        共 {posts.length} 篇文章
      </div>
    </div>
  )
}
