import { 
  MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSub, 
  MenubarSubTrigger, MenubarSubContent, MenubarSeparator, MenubarCheckboxItem 
} from '@radix-ui/react-menubar'
import { Moon, Sun, PanelLeft, Monitor, Smartphone, Palette, FileCode } from 'lucide-react'
import { widthOptions } from '@md/shared/configs'
import { useUIStore } from '@/stores/useUIStore'
import { useThemeStore } from '@/stores/useThemeStore'

const itemClass = "px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer select-none flex items-center"
const subTriggerClass = "px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer select-none flex items-center justify-between"
const contentClass = "min-w-[180px] bg-popover text-popover-foreground border rounded-md shadow-md p-1 z-50"
const checkboxClass = "px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer select-none flex items-center"

export function ViewDropdown() {
  const { 
    isDark, isEditOnLeft, isShowCssEditor, isOpenRightSlider,
    isShowFloatingToc, isPinFloatingToc
  } = useUIStore()
  const { previewWidth, setPreviewWidth } = useThemeStore()
  
  const mobileWidth = widthOptions[0]?.value || 'w-[375px]'
  const desktopWidth = widthOptions[1]?.value || 'w-full'

  return (
    <MenubarMenu>
      <MenubarTrigger className="px-3 py-1.5 text-sm font-medium rounded hover:bg-accent hover:text-accent-foreground cursor-pointer data-[state=open]:bg-accent data-[state=open]:text-accent-foreground outline-none select-none">
        视图
      </MenubarTrigger>
      <MenubarContent className={contentClass}>
        {/* 外观子菜单 */}
        <MenubarSub>
          <MenubarSubTrigger className={subTriggerClass}>
            {isDark ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
            外观
          </MenubarSubTrigger>
          <MenubarSubContent className={contentClass}>
            <MenubarCheckboxItem 
              checked={!isDark}
              onCheckedChange={() => useUIStore.setState({ isDark: false })}
              className={checkboxClass}
            >
              浅色模式
            </MenubarCheckboxItem>
            <MenubarCheckboxItem 
              checked={isDark}
              onCheckedChange={() => useUIStore.setState({ isDark: true })}
              className={checkboxClass}
            >
              深色模式
            </MenubarCheckboxItem>
          </MenubarSubContent>
        </MenubarSub>

        {/* 编辑模式子菜单 */}
        <MenubarSub>
          <MenubarSubTrigger className={subTriggerClass}>
            <PanelLeft className="mr-2 h-4 w-4" />
            编辑模式
          </MenubarSubTrigger>
          <MenubarSubContent className={contentClass}>
            <MenubarCheckboxItem 
              checked={isEditOnLeft}
              onCheckedChange={() => useUIStore.setState({ isEditOnLeft: true })}
              className={checkboxClass}
            >
              左侧编辑
            </MenubarCheckboxItem>
            <MenubarCheckboxItem 
              checked={!isEditOnLeft}
              onCheckedChange={() => useUIStore.setState({ isEditOnLeft: false })}
              className={checkboxClass}
            >
              右侧编辑
            </MenubarCheckboxItem>
          </MenubarSubContent>
        </MenubarSub>

        {/* 预览模式子菜单 */}
        <MenubarSub>
          <MenubarSubTrigger className={subTriggerClass}>
            {previewWidth === mobileWidth ? <Smartphone className="mr-2 h-4 w-4" /> : <Monitor className="mr-2 h-4 w-4" />}
            预览模式
          </MenubarSubTrigger>
          <MenubarSubContent className={contentClass}>
            <MenubarCheckboxItem 
              checked={previewWidth === mobileWidth}
              onCheckedChange={() => setPreviewWidth(mobileWidth)}
              className={checkboxClass}
            >
              移动端
            </MenubarCheckboxItem>
            <MenubarCheckboxItem 
              checked={previewWidth === desktopWidth}
              onCheckedChange={() => setPreviewWidth(desktopWidth)}
              className={checkboxClass}
            >
              电脑端
            </MenubarCheckboxItem>
          </MenubarSubContent>
        </MenubarSub>

        {/* 浮动目录子菜单 */}
        <MenubarSub>
          <MenubarSubTrigger className={subTriggerClass}>
            <PanelLeft className="mr-2 h-4 w-4" />
            浮动目录
          </MenubarSubTrigger>
          <MenubarSubContent className={contentClass}>
            <MenubarCheckboxItem 
              checked={isShowFloatingToc && isPinFloatingToc}
              onCheckedChange={() => useUIStore.setState({ isShowFloatingToc: true, isPinFloatingToc: true })}
              className={checkboxClass}
            >
              常驻显示
            </MenubarCheckboxItem>
            <MenubarCheckboxItem 
              checked={isShowFloatingToc && !isPinFloatingToc}
              onCheckedChange={() => useUIStore.setState({ isShowFloatingToc: true, isPinFloatingToc: false })}
              className={checkboxClass}
            >
              移入触发
            </MenubarCheckboxItem>
            <MenubarCheckboxItem 
              checked={!isShowFloatingToc}
              onCheckedChange={() => useUIStore.setState({ isShowFloatingToc: false })}
              className={checkboxClass}
            >
              隐藏
            </MenubarCheckboxItem>
          </MenubarSubContent>
        </MenubarSub>

        <MenubarSeparator className="h-px bg-border my-1" />

        <MenubarItem 
          onSelect={() => useUIStore.setState(s => ({ isOpenRightSlider: !s.isOpenRightSlider }))}
          className={itemClass}
        >
          <Palette className="mr-2 h-4 w-4" />
          样式面板
        </MenubarItem>
        <MenubarItem 
          onSelect={() => useUIStore.setState(s => ({ isShowCssEditor: !s.isShowCssEditor }))}
          className={itemClass}
        >
          <FileCode className="mr-2 h-4 w-4" />
          CSS 编辑器
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
