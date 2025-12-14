import { 
  MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSub,
  MenubarSubTrigger, MenubarSubContent, MenubarSeparator, MenubarCheckboxItem
} from '@radix-ui/react-menubar'
import { Check } from 'lucide-react'
import { 
  themeOptions, fontFamilyOptions, fontSizeOptions, colorOptions,
  codeBlockThemeOptions, legendOptions
} from '@md/shared/configs'
import { useThemeStore } from '@/stores/useThemeStore'
import { useUIStore } from '@/stores/useUIStore'
import { useEditorStore } from '@/stores/useEditorStore'
import { useRenderStore } from '@/stores/useRenderStore'

const itemClass = "px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer select-none flex items-center"
const subTriggerClass = "px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer select-none flex items-center justify-between"
const contentClass = "min-w-[180px] bg-popover text-popover-foreground border rounded-md shadow-md p-1 z-50 max-h-[300px] overflow-y-auto"
const checkboxClass = "px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer select-none flex items-center justify-between"

interface StyleOptionMenuProps {
  title: string
  options: { label: string; value: string; desc?: string }[]
  current: string
  onChange: (value: string) => void
}

function StyleOptionMenu({ title, options, current, onChange }: StyleOptionMenuProps) {
  return (
    <MenubarSub>
      <MenubarSubTrigger className={subTriggerClass}>
        {title}
      </MenubarSubTrigger>
      <MenubarSubContent className={contentClass}>
        {options.map(opt => (
          <MenubarCheckboxItem 
            key={opt.value}
            checked={current === opt.value}
            onCheckedChange={() => onChange(opt.value)}
            className={checkboxClass}
          >
            <span className="flex-1">{opt.label}</span>
            {current === opt.value && <Check className="h-4 w-4" />}
          </MenubarCheckboxItem>
        ))}
      </MenubarSubContent>
    </MenubarSub>
  )
}

export function StyleDropdown() {
  const themeStore = useThemeStore()
  const { toggleShowCssEditor, openConfirmDialog } = useUIStore()
  const { getContent } = useEditorStore()
  const { render } = useRenderStore()

  const editorRefresh = () => {
    themeStore.updateCodeTheme()
    const raw = getContent()
    render(raw, {
      isCiteStatus: themeStore.isCiteStatus,
      legend: themeStore.legend,
      isUseIndent: themeStore.isUseIndent,
      isUseJustify: themeStore.isUseJustify,
      isCountStatus: themeStore.isCountStatus,
      isMacCodeBlock: themeStore.isMacCodeBlock,
      isShowLineNumber: themeStore.isShowLineNumber,
    })
  }

  const handleThemeChange = (value: string) => {
    themeStore.setTheme(value as any)
    themeStore.applyCurrentTheme()
    editorRefresh()
  }

  const handleFontChange = (value: string) => {
    themeStore.setFontFamily(value)
    themeStore.applyCurrentTheme()
    editorRefresh()
  }

  const handleSizeChange = (value: string) => {
    themeStore.setFontSize(value)
    themeStore.applyCurrentTheme()
    editorRefresh()
  }

  const handleColorChange = (value: string) => {
    themeStore.setPrimaryColor(value)
    themeStore.applyCurrentTheme()
    editorRefresh()
  }

  const handleCodeThemeChange = (value: string) => {
    themeStore.setCodeBlockTheme(value)
    editorRefresh()
  }

  const handleLegendChange = (value: string) => {
    themeStore.setLegend(value)
    editorRefresh()
  }

  const handleMacCodeBlockToggle = () => {
    themeStore.toggleMacCodeBlock()
    editorRefresh()
  }

  return (
    <MenubarMenu>
      <MenubarTrigger className="px-3 py-1.5 text-sm font-medium rounded hover:bg-accent hover:text-accent-foreground cursor-pointer data-[state=open]:bg-accent data-[state=open]:text-accent-foreground outline-none select-none">
        样式
      </MenubarTrigger>
      <MenubarContent className="min-w-[200px] bg-popover text-popover-foreground border rounded-md shadow-md p-1 z-50">
        <StyleOptionMenu 
          title="主题" 
          options={themeOptions} 
          current={themeStore.theme} 
          onChange={handleThemeChange}
        />
        <MenubarSeparator className="h-px bg-border my-1" />
        <StyleOptionMenu 
          title="字体" 
          options={fontFamilyOptions} 
          current={themeStore.fontFamily} 
          onChange={handleFontChange}
        />
        <StyleOptionMenu 
          title="字号" 
          options={fontSizeOptions} 
          current={themeStore.fontSize} 
          onChange={handleSizeChange}
        />
        <StyleOptionMenu 
          title="主题色" 
          options={colorOptions} 
          current={themeStore.primaryColor} 
          onChange={handleColorChange}
        />
        <StyleOptionMenu 
          title="代码块主题" 
          options={codeBlockThemeOptions} 
          current={themeStore.codeBlockTheme} 
          onChange={handleCodeThemeChange}
        />
        <StyleOptionMenu 
          title="图注格式" 
          options={legendOptions} 
          current={themeStore.legend} 
          onChange={handleLegendChange}
        />
        <MenubarSeparator className="h-px bg-border my-1" />
        <MenubarItem onSelect={toggleShowCssEditor} className={itemClass}>
          自定义 CSS
        </MenubarItem>
        <MenubarSeparator className="h-px bg-border my-1" />
        <MenubarCheckboxItem 
          checked={themeStore.isMacCodeBlock}
          onCheckedChange={handleMacCodeBlockToggle}
          className={checkboxClass}
        >
          Mac 代码块
        </MenubarCheckboxItem>
        <MenubarSeparator className="h-px bg-border my-1" />
        <MenubarItem onSelect={() => openConfirmDialog(true)} className={itemClass}>
          重置样式
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  )
}
