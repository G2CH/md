import { useRenderStore } from '@/stores/useRenderStore'

export function PostInfo() {
  const { readingTime } = useRenderStore()
  
  return (
    <div className="flex items-center gap-3 text-sm text-muted-foreground">
      <span>{readingTime.words} 字</span>
      <span>·</span>
      <span>约 {readingTime.minutes} 分钟</span>
    </div>
  )
}
