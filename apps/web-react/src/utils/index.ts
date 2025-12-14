export * from '@md/shared/utils'
export {
  modifyHtmlContent,
  postProcessHtml,
  renderMarkdown,
} from '@md/core/utils'

import { prefix } from '@md/shared/configs'
export function addPrefix(str: string) {
  return `${prefix}__${str}`
}

/**
 * Process clipboard content for WeChat compatibility
 * Converts CSS variables and adjusts styles
 */
export async function processClipboardContent(_primaryColor: string = '#1e80ff') {
  const outputElement = document.getElementById('output')
  if (!outputElement) return

  // Convert CSS variables to actual values for clipboard
  const allElements = outputElement.querySelectorAll('*')
  allElements.forEach((el) => {
    const element = el as HTMLElement
    const style = window.getComputedStyle(element)
    
    // Copy computed color values to inline styles for WeChat compatibility
    const color = style.color
    const bgColor = style.backgroundColor
    
    if (color && color !== 'rgba(0, 0, 0, 0)') {
      element.style.color = color
    }
    if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
      element.style.backgroundColor = bgColor
    }
  })
}
