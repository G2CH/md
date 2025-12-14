import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Footer } from './Footer'
import { Editor } from '../editor/Editor'
import { Preview } from '../content/Preview'
import { RightSlider } from './RightSlider'
import { CssEditor } from '../editor/CssEditor'
import { useUIStore } from '@/stores/useUIStore'

export function AppLayout() {
  const { isOpenPostSlider, isOpenRightSlider, isEditOnLeft, isShowCssEditor } = useUIStore()
  
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background text-foreground">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden border rounded-lg m-2">
          <PanelGroup direction="horizontal">
            {isOpenPostSlider && (
              <>
                <Panel defaultSize={15} minSize={10} maxSize={20} collapsible order={1} id="sidebar">
                  <Sidebar />
                </Panel>
                <PanelResizeHandle className="w-[1px] bg-border hover:bg-primary transition-colors hover:w-1 z-10" />
              </>
            )}
            <Panel order={2} id="main" className="flex">
              <PanelGroup direction="horizontal">
                <Panel defaultSize={50} minSize={20} order={isEditOnLeft ? 1 : 2} id="editor">
                  <div className={`h-full bg-background overflow-hidden relative ${isEditOnLeft ? 'border-r' : 'border-l'}`}>
                    <Editor />
                  </div>
                </Panel>
                <PanelResizeHandle className="w-[1px] bg-border hover:bg-primary transition-colors hover:w-1 z-10" />
                <Panel defaultSize={50} minSize={20} order={isEditOnLeft ? 2 : 1} id="preview">
                  <div className="h-full bg-background overflow-hidden relative preview-wrapper">
                    <Preview />
                  </div>
                </Panel>
              </PanelGroup>
            </Panel>
            {/* CSS Editor (non-resizable panel) */}
            {isShowCssEditor && !useUIStore.getState().isMobile && (
              <>
                <PanelResizeHandle className="w-[1px] bg-border hover:bg-primary transition-colors hover:w-1 z-10" />
                <Panel defaultSize={20} minSize={15} maxSize={35} order={3} id="css-editor">
                  <CssEditor />
                </Panel>
              </>
            )}
            {isOpenRightSlider && (
              <>
                <PanelResizeHandle className="w-[1px] bg-border hover:bg-primary transition-colors hover:w-1 z-10" />
                <Panel defaultSize={20} minSize={15} maxSize={30} order={4} id="right-slider">
                  <RightSlider />
                </Panel>
              </>
            )}
          </PanelGroup>
        </div>
      </main>
      <Footer />
      {/* Mobile CSS Editor - rendered as overlay */}
      {isShowCssEditor && useUIStore.getState().isMobile && <CssEditor />}
    </div>
  )
}

