import { useState } from 'react'
import { List } from 'lucide-react'
import { useRenderStore } from '@/stores/useRenderStore'
import { useUIStore } from '@/stores/useUIStore'

export function FloatingToc() {
  const { titleList } = useRenderStore()
  const { isShowFloatingToc, isPinFloatingToc } = useUIStore()
  const [isHovered, setIsHovered] = useState(false)

  if (!isShowFloatingToc) return null

  const isExpanded = isHovered || isPinFloatingToc

  return (
    <div
      className="absolute left-0 top-0 bg-background border rounded-br-lg rounded-tr-lg rounded-bl-lg p-2 text-sm shadow-sm z-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <List className="w-6 h-6" />
      <ul
        className={`overflow-auto transition-all duration-300 ${
          isExpanded ? 'max-h-96 w-60 mt-2' : 'max-h-0 w-0'
        }`}
      >
        {titleList.map((item, index) => (
          <li
            key={index}
            className="line-clamp-1 py-1 leading-6 hover:bg-gray-300 dark:hover:bg-gray-600 rounded cursor-pointer"
            style={{ paddingLeft: `${item.level - 0.5}em` }}
          >
            <a href={item.url} className="block">
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
