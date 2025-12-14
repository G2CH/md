import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { defaultStyleConfig, widthOptions, type ThemeName } from '@md/shared/configs'
import { applyTheme } from '@md/core'
// import { useCssEditorStore } from './useCssEditorStore' // dynamic import

interface ThemeState {
  theme: ThemeName
  fontFamily: string
  fontSize: string
  primaryColor: string
  codeBlockTheme: string
  legend: string
  isMacCodeBlock: boolean
  isShowLineNumber: boolean
  isCiteStatus: boolean
  isCountStatus: boolean
  isUseIndent: boolean
  isUseJustify: boolean
  previewWidth: string

  // Actions
  toggleMacCodeBlock: () => void
  toggleShowLineNumber: () => void
  toggleCiteStatus: () => void
  toggleCountStatus: () => void
  toggleUseIndent: () => void
  toggleUseJustify: () => void
  setPreviewWidth: (width: string) => void
  resetStyle: () => void
  updateCodeTheme: () => void
  applyCurrentTheme: () => Promise<void>
  
  // Setters
  setTheme: (theme: ThemeName) => void
  setFontFamily: (font: string) => void
  setFontSize: (size: string) => void
  setPrimaryColor: (color: string) => void
  setCodeBlockTheme: (theme: string) => void
  setLegend: (legend: string) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: defaultStyleConfig.theme,
      fontFamily: defaultStyleConfig.fontFamily,
      fontSize: defaultStyleConfig.fontSize,
      primaryColor: defaultStyleConfig.primaryColor,
      codeBlockTheme: defaultStyleConfig.codeBlockTheme,
      legend: defaultStyleConfig.legend,
      isMacCodeBlock: defaultStyleConfig.isMacCodeBlock,
      isShowLineNumber: defaultStyleConfig.isShowLineNumber,
      isCiteStatus: defaultStyleConfig.isCiteStatus,
      isCountStatus: defaultStyleConfig.isCountStatus,
      isUseIndent: false,
      isUseJustify: false,
      previewWidth: widthOptions[0].value,

      toggleMacCodeBlock: () => set((state) => ({ isMacCodeBlock: !state.isMacCodeBlock })),
      toggleShowLineNumber: () => set((state) => ({ isShowLineNumber: !state.isShowLineNumber })),
      toggleCiteStatus: () => set((state) => ({ isCiteStatus: !state.isCiteStatus })),
      toggleCountStatus: () => set((state) => ({ isCountStatus: !state.isCountStatus })),
      toggleUseIndent: () => set((state) => ({ isUseIndent: !state.isUseIndent })),
      toggleUseJustify: () => set((state) => ({ isUseJustify: !state.isUseJustify })),
      setPreviewWidth: (width) => set({ previewWidth: width }),

      setTheme: (theme) => set({ theme }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setFontSize: (fontSize) => set({ fontSize }),
      setPrimaryColor: (primaryColor) => set({ primaryColor }),
      setCodeBlockTheme: (codeBlockTheme) => set({ codeBlockTheme }),
      setLegend: (legend) => set({ legend }),

      resetStyle: () => set({
        isCiteStatus: defaultStyleConfig.isCiteStatus,
        isMacCodeBlock: defaultStyleConfig.isMacCodeBlock,
        isShowLineNumber: defaultStyleConfig.isShowLineNumber,
        isCountStatus: defaultStyleConfig.isCountStatus,
        theme: defaultStyleConfig.theme,
        fontFamily: defaultStyleConfig.fontFamily,
        fontSize: defaultStyleConfig.fontSize,
        primaryColor: defaultStyleConfig.primaryColor,
        codeBlockTheme: defaultStyleConfig.codeBlockTheme,
        legend: defaultStyleConfig.legend,
        isUseIndent: false,
        isUseJustify: false,
      }),

      updateCodeTheme: () => {
        const cssUrl = get().codeBlockTheme
        const el = document.querySelector('#hljs')
        if (el) {
          el.setAttribute('href', cssUrl)
        } else {
          const link = document.createElement('link')
          link.setAttribute('type', 'text/css')
          link.setAttribute('rel', 'stylesheet')
          link.setAttribute('href', cssUrl)
          link.setAttribute('id', 'hljs')
          document.head.appendChild(link)
        }
      },

      applyCurrentTheme: async () => {
        try {
          // Mocking CssEditorStore for now or need to port it
          // const { useCssEditorStore } = await import('@/stores/useCssEditorStore')
          // const customCSS = useCssEditorStore.getState().getCurrentTabContent()
          const customCSS = '' // TODO: Port CssEditorStore

          await applyTheme({
            themeName: get().theme,
            customCSS,
            variables: {
              primaryColor: get().primaryColor,
              fontFamily: get().fontFamily,
              fontSize: get().fontSize,
              isUseIndent: get().isUseIndent,
              isUseJustify: get().isUseJustify,
            },
          })
        } catch (error) {
          console.error('[applyCurrentTheme] 主题应用失败:', error)
        }
      },
    }),
    {
      name: 'md-theme-storage',
    }
  )
)
