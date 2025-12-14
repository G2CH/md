import { create } from 'zustand'
import { initRenderer } from '@md/core'
import { postProcessHtml, renderMarkdown } from '@/utils'

interface ReadingTime {
  chars: number
  words: number
  minutes: number
}

interface TitleItem {
  url: string
  title: string
  level: number
}

interface RenderState {
  output: string
  readingTime: ReadingTime
  titleList: TitleItem[]
  renderer: ReturnType<typeof initRenderer> | null

  // Actions
  initRendererInstance: (options?: {
    isMacCodeBlock?: boolean
    isShowLineNumber?: boolean
  }) => ReturnType<typeof initRenderer>
  getRenderer: () => ReturnType<typeof initRenderer> | null
  render: (content: string, options: any) => string
  extractTitles: () => void
}

export const useRenderStore = create<RenderState>((set, get) => ({
  output: '',
  readingTime: {
    chars: 0,
    words: 0,
    minutes: 0,
  },
  titleList: [],
  renderer: null,

  initRendererInstance: (options) => {
    const renderer = initRenderer(options || {})
    set({ renderer })
    return renderer
  },

  getRenderer: () => get().renderer,

  extractTitles: () => {
    const output = get().output
    if (!output) return

    const div = document.createElement('div')
    div.innerHTML = output
    const list = div.querySelectorAll<HTMLElement>('[data-heading]')

    const titleList: TitleItem[] = []
    let i = 0
    list.forEach((item) => {
      item.setAttribute('id', `${i}`)
      titleList.push({
        url: `#${i}`,
        title: item.textContent || '',
        level: Number(item.tagName.slice(1)),
      })
      i++
    })
    set({ titleList, output: div.innerHTML })
  },

  render: (content, options) => {
    const renderer = get().renderer
    if (!renderer) {
      throw new Error('Renderer not initialized. Call initRendererInstance first.')
    }

    renderer.reset({
      citeStatus: options.isCiteStatus,
      legend: options.legend,
      countStatus: options.isCountStatus,
      isMacCodeBlock: options.isMacCodeBlock,
      isShowLineNumber: options.isShowLineNumber,
    })

    const { html: baseHtml, readingTime: readingTimeResult } = renderMarkdown(content, renderer)

    set((_state) => ({
      readingTime: {
        chars: content.length,
        words: readingTimeResult.words,
        minutes: Math.ceil(readingTimeResult.minutes),
      },
    }))

    const finalHtml = postProcessHtml(baseHtml, readingTimeResult, renderer)
    set({ output: finalHtml })

    get().extractTitles()

    return finalHtml
  },
}))
