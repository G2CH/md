import { 
  MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem 
} from '@radix-ui/react-menubar'
import { Image, Table, Contact } from 'lucide-react'
import { useUIStore } from '@/stores/useUIStore'

const itemClass = "px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer select-none flex items-center"
const contentClass = "min-w-[180px] bg-popover text-popover-foreground border rounded-md shadow-md p-1 z-50"

export function InsertDropdown() {
  const { toggleShowUploadImgDialog, toggleShowInsertFormDialog, toggleShowInsertMpCardDialog } = useUIStore()

  return (
    <MenubarMenu>
      <MenubarTrigger className="px-3 py-1.5 text-sm font-medium rounded hover:bg-accent hover:text-accent-foreground cursor-pointer data-[state=open]:bg-accent data-[state=open]:text-accent-foreground outline-none select-none">
        插入
      </MenubarTrigger>
      <MenubarContent className={contentClass}>
        <MenubarItem onSelect={() => toggleShowUploadImgDialog(true)} className={itemClass}>
          <Image className="mr-2 h-4 w-4" />
          插入图片
        </MenubarItem>
        <MenubarItem onSelect={toggleShowInsertFormDialog} className={itemClass}>
          <Table className="mr-2 h-4 w-4" />
          插入表格
        </MenubarItem>
        <MenubarItem onSelect={toggleShowInsertMpCardDialog} className={itemClass}>
          <Contact className="mr-2 h-4 w-4" />
          公众号名片
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
