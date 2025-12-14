// Browser shim for postcss - just pass through CSS
// The actual postcss processing with source-map-js doesn't work in browser

export function postcss(_plugins: unknown[]) {
  return {
    process: async (css: string, _options?: unknown) => {
      return { css, warnings: () => [], messages: [] }
    },
  }
}

export default postcss
