import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  isDark: boolean
  isEditOnLeft: boolean
  showAIToolbox: boolean
  hasShownAIToolboxHint: boolean
  isOpenRightSlider: boolean
  isOpenPostSlider: boolean
  isMobile: boolean
  isPinFloatingToc: boolean
  isShowFloatingToc: boolean
  
  // Dialogs
  isShowCssEditor: boolean
  isShowInsertFormDialog: boolean
  isShowInsertMpCardDialog: boolean
  isShowUploadImgDialog: boolean
  isShowTemplateDialog: boolean
  isOpenConfirmDialog: boolean
  aiDialogVisible: boolean
  aiImageDialogVisible: boolean
  
  // Search
  searchTabRequest: { word: string; showReplace: boolean } | null

  // Actions
  toggleDark: () => void
  toggleEditOnLeft: () => void
  toggleAIToolbox: () => void
  togglePinFloatingToc: () => void
  toggleShowFloatingToc: () => void
  togglePostSlider: () => void
  
  // Dialog Actions
  toggleShowCssEditor: () => void
  toggleShowInsertFormDialog: () => void
  toggleShowInsertMpCardDialog: () => void
  toggleShowUploadImgDialog: (show?: boolean) => void
  toggleShowTemplateDialog: () => void
  toggleAIDialog: (visible?: boolean) => void
  toggleAIImageDialog: (visible?: boolean) => void
  openConfirmDialog: (open: boolean) => void
  
  // Search Actions
  openSearchTab: (word?: string, showReplace?: boolean) => void
  clearSearchTabRequest: () => void
  
  // Setter for mobile
  setIsMobile: (isMobile: boolean) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isDark: false,
      isEditOnLeft: true,
      showAIToolbox: true,
      hasShownAIToolboxHint: false,
      isOpenRightSlider: false,
      isOpenPostSlider: false,
      isMobile: false,
      isPinFloatingToc: false,
      isShowFloatingToc: true,

      isShowCssEditor: false,
      isShowInsertFormDialog: false,
      isShowInsertMpCardDialog: false,
      isShowUploadImgDialog: false,
      isShowTemplateDialog: false,
      isOpenConfirmDialog: false,
      aiDialogVisible: false,
      aiImageDialogVisible: false,
      searchTabRequest: null,

      toggleDark: () => set((state) => {
         const next = !state.isDark
         if (next) document.documentElement.classList.add('dark')
         else document.documentElement.classList.remove('dark')
         return { isDark: next }
      }),
      toggleEditOnLeft: () => set((state) => ({ isEditOnLeft: !state.isEditOnLeft })),
      toggleAIToolbox: () => set((state) => ({ showAIToolbox: !state.showAIToolbox })),
      togglePinFloatingToc: () => set((state) => ({ isPinFloatingToc: !state.isPinFloatingToc })),
      toggleShowFloatingToc: () => set((state) => ({ isShowFloatingToc: !state.isShowFloatingToc })),
      togglePostSlider: () => set((state) => ({ isOpenPostSlider: !state.isOpenPostSlider })),

      toggleShowCssEditor: () => set((state) => ({ isShowCssEditor: !state.isShowCssEditor })),
      toggleShowInsertFormDialog: () => set((state) => ({ isShowInsertFormDialog: !state.isShowInsertFormDialog })),
      toggleShowInsertMpCardDialog: () => set((state) => ({ isShowInsertMpCardDialog: !state.isShowInsertMpCardDialog })),
      toggleShowUploadImgDialog: (show) => set((state) => ({ isShowUploadImgDialog: show ?? !state.isShowUploadImgDialog })),
      toggleShowTemplateDialog: () => set((state) => ({ isShowTemplateDialog: !state.isShowTemplateDialog })),
      toggleAIDialog: (visible) => set((state) => ({ aiDialogVisible: visible ?? !state.aiDialogVisible })),
      toggleAIImageDialog: (visible) => set((state) => ({ aiImageDialogVisible: visible ?? !state.aiImageDialogVisible })),
      openConfirmDialog: (open) => set({ isOpenConfirmDialog: open }),

      openSearchTab: (word = '', showReplace = false) => set({ searchTabRequest: { word, showReplace } }),
      clearSearchTabRequest: () => set({ searchTabRequest: null }),
      setIsMobile: (isMobile) => set({ isMobile }),
    }),
    {
      name: 'md-ui-storage',
      partialize: (state) => ({
          isDark: state.isDark,
          isEditOnLeft: state.isEditOnLeft,
          showAIToolbox: state.showAIToolbox,
          hasShownAIToolboxHint: state.hasShownAIToolboxHint,
          isOpenRightSlider: state.isOpenRightSlider,
          isOpenPostSlider: state.isOpenPostSlider,
          isPinFloatingToc: state.isPinFloatingToc,
          isShowFloatingToc: state.isShowFloatingToc,
      }), 
    }
  )
)
