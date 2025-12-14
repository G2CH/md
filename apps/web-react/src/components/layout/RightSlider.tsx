import { useThemeStore } from '@/stores/useThemeStore'
import { useUIStore } from '@/stores/useUIStore'
import { 
  themeOptions, fontFamilyOptions, fontSizeOptions, colorOptions, 
  codeBlockThemeOptions, legendOptions, themeMap 
} from '@md/shared/configs'
import { X, Check } from 'lucide-vue-next' // Wait, imports are mixed? lucide-react in React.
import { X as XIcon, Check as CheckIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function RightSlider() {
  const { 
    theme, setTheme,
    fontFamily, setFontFamily,
    fontSize, setFontSize,
    primaryColor, setPrimaryColor,
    codeBlockTheme, setCodeBlockTheme,
    legend, setLegend,
    isMacCodeBlock, toggleMacCodeBlock,
    isShowLineNumber, toggleShowLineNumber,
    isCiteStatus, toggleCiteStatus,
    isUseIndent, toggleUseIndent,
    isUseJustify, toggleUseJustify,
    applyCurrentTheme,
    resetStyle
  } = useThemeStore()

  const { isOpenRightSlider } = useUIStore()
  const toggleRightSlider = () => useUIStore.setState(s => ({ isOpenRightSlider: !s.isOpenRightSlider }))

  // Apply theme when settings change
  // Ideally this should be done in store subscribers or useEffect.
  // In Vue app, it was done in change handlers. 
  // Let's do it in change handlers here too or Effect.
  // Using Effect in Editor.tsx or here?
  // Theme application affects global styles (CSS variables).
  // Let's do it here on change.
  
  const handleThemeChange = (val: string) => {
      setTheme(val as any)
      setTimeout(() => applyCurrentTheme(), 0)
  }
  
  // Similar helpers for others... 
  // Or just use useEffect on stores changes.
  // But store is persisted, so hydration might trigger it.
  
  useEffect(() => {
     applyCurrentTheme()
  }, [theme, fontFamily, fontSize, primaryColor, isUseIndent, isUseJustify]) 

  const [activeTab, setActiveTab] = useState('style')

  if (!isOpenRightSlider) return null

  return (
    <div className="h-full w-80 border-l bg-background flex flex-col transition-all duration-300">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-lg">样式设置</h2>
        <button onClick={toggleRightSlider} className="p-1 hover:bg-accent rounded">
           <XIcon className="w-5 h-5" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Theme */}
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">主题</h3>
            <div className="grid grid-cols-3 gap-2">
                {themeOptions.map(opt => (
                    <button 
                        key={opt.value}
                        onClick={() => handleThemeChange(opt.value)}
                        className={`text-xs p-2 border rounded hover:bg-accent ${theme === opt.value ? 'border-primary ring-1 ring-primary' : 'border-border'}`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Font Family */}
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">字体</h3>
            <div className="grid grid-cols-3 gap-2">
                {fontFamilyOptions.map(opt => (
                    <button 
                        key={opt.value}
                        onClick={() => setFontFamily(opt.value)}
                        className={`text-xs p-2 border rounded hover:bg-accent ${fontFamily === opt.value ? 'border-primary ring-1 ring-primary' : 'border-border'}`}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">字号</h3>
            <div className="grid grid-cols-5 gap-2">
                {fontSizeOptions.map(opt => (
                    <button 
                        key={opt.value}
                        onClick={() => setFontSize(opt.value)}
                        className={`text-xs p-2 border rounded hover:bg-accent ${fontSize === opt.value ? 'border-primary ring-1 ring-primary' : 'border-border'}`}
                    >
                        {opt.desc}
                    </button>
                ))}
            </div>
        </div>

        {/* Primary Color */}
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">主题色</h3>
            <div className="grid grid-cols-3 gap-2">
                {colorOptions.map(opt => (
                    <button 
                        key={opt.value}
                        onClick={() => setPrimaryColor(opt.value)}
                        className={`text-xs p-2 border rounded hover:bg-accent flex items-center justify-center gap-1 ${primaryColor === opt.value ? 'border-primary ring-1 ring-primary' : 'border-border'}`}
                    >
                        <span className="w-3 h-3 rounded-full" style={{ background: opt.value }} />
                        {opt.label}
                    </button>
                ))}
            </div>
            {/* Custom Color Picker Placeholder */}
            <div className="flex items-center gap-2 mt-2">
                <label className="text-xs">自定义:</label>
                <input 
                    type="color" 
                    value={primaryColor} 
                    onChange={(e) => setPrimaryColor(e.target.value)} 
                    className="h-8 w-full cursor-pointer"
                />
            </div>
        </div>

        {/* Code Block Theme */}
        <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">代码块主题</h3>
            <select 
                value={codeBlockTheme} 
                onChange={(e) => {
                    setCodeBlockTheme(e.target.value);
                    // trigger updateCodeTheme
                    // useThemeStore.getState().updateCodeTheme() // done in useEffect in Editor or here
                    // Editor.vue called editorRefresh() which called updateCodeTheme()
                    // I'll call it here.
                    import('@/stores/useThemeStore').then(({useThemeStore}) => useThemeStore.getState().updateCodeTheme())
                }}
                className="w-full p-2 text-sm border rounded bg-background"
            >
                {codeBlockThemeOptions.map(opt => (
                    <option key={opt.label} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>

        {/* Toggles */}
        <div className="space-y-4">
             {/* Mac Code Block */}
             <div className="flex items-center justify-between">
                <span className="text-sm">Mac 代码块</span>
                <button onClick={toggleMacCodeBlock} className={`w-10 h-5 rounded-full transition-colors ${isMacCodeBlock ? 'bg-primary' : 'bg-muted'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform transform ${isMacCodeBlock ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
             </div>
             {/* Line Number */}
             <div className="flex items-center justify-between">
                <span className="text-sm">显示行号</span>
                <button onClick={toggleShowLineNumber} className={`w-10 h-5 rounded-full transition-colors ${isShowLineNumber ? 'bg-primary' : 'bg-muted'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform transform ${isShowLineNumber ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
             </div>
             {/* Cite Status */}
             <div className="flex items-center justify-between">
                <span className="text-sm">微信外链转底部引用</span>
                <button onClick={toggleCiteStatus} className={`w-10 h-5 rounded-full transition-colors ${isCiteStatus ? 'bg-primary' : 'bg-muted'}`}>
                    <div className={`w-3 h-3 bg-white rounded-full transition-transform transform ${isCiteStatus ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
             </div>
        </div>

        {/* Reset */}
        <div className="pt-4 border-t">
            <button onClick={() => {
                if(confirm('确定要重置样式吗？')) {
                    resetStyle()
                    // re-apply
                    setTimeout(() => applyCurrentTheme(), 100)
                }
            }} className="w-full py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition-colors">
                重置样式
            </button>
        </div>

      </div>
    </div>
  )
}
