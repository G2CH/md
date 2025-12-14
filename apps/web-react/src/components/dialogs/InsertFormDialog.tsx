import { useState } from 'react'
import { useUIStore } from '@/stores/useUIStore'
import { useEditorStore } from '@/stores/useEditorStore'
import { toast } from 'sonner'

function createTable(rows: number, cols: number, data: Record<string, string>): string {
  const lines: string[] = []
  
  // Header row
  const headers = Array.from({ length: cols }, (_, i) => data[`k_0_${i}`] || `列${i + 1}`)
  lines.push(`| ${headers.join(' | ')} |`)
  
  // Separator
  lines.push(`| ${Array(cols).fill('---').join(' | ')} |`)
  
  // Data rows
  for (let row = 1; row <= rows; row++) {
    const cells = Array.from({ length: cols }, (_, col) => data[`k_${row}_${col}`] || '')
    lines.push(`| ${cells.join(' | ')} |`)
  }
  
  return lines.join('\n')
}

export function InsertFormDialog() {
  const { isShowInsertFormDialog, toggleShowInsertFormDialog } = useUIStore()
  const { editor } = useEditorStore()
  
  const [rowNum, setRowNum] = useState(3)
  const [colNum, setColNum] = useState(3)
  const [tableData, setTableData] = useState<Record<string, string>>({})

  const resetVal = () => {
    setRowNum(3)
    setColNum(3)
    setTableData({})
  }

  const insertTable = () => {
    if (!editor) {
      toast.error('编辑器未初始化')
      return
    }
    
    const table = createTable(rowNum, colNum, tableData)
    const selection = editor.state.selection.main
    editor.dispatch({
      changes: { from: selection.from, to: selection.to, insert: `\n${table}\n` },
    })
    
    resetVal()
    toggleShowInsertFormDialog()
    toast.success('表格已插入')
  }

  const handleInputChange = (key: string, value: string) => {
    setTableData(prev => ({ ...prev, [key]: value }))
  }

  if (!isShowInsertFormDialog) return null

  return (
    <div 
      className="fixed inset-0 z-50"
      onClick={toggleShowInsertFormDialog}
    >
      <div className="absolute inset-0 bg-black/50" />
      
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-background rounded-lg shadow-lg p-6"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={toggleShowInsertFormDialog}
          className="absolute top-4 right-4 p-1 rounded hover:bg-accent"
        >
          ✕
        </button>
        
        <h2 className="text-lg font-semibold mb-4">插入表格</h2>
        
        {/* Row/Col inputs */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm mb-1">行数</label>
            <div className="flex items-center border rounded">
              <button 
                onClick={() => setRowNum(Math.max(1, rowNum - 1))}
                className="px-3 py-2 hover:bg-accent"
              >
                -
              </button>
              <input 
                type="number" 
                value={rowNum} 
                onChange={e => setRowNum(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
                className="w-full text-center bg-transparent focus:outline-none"
              />
              <button 
                onClick={() => setRowNum(Math.min(100, rowNum + 1))}
                className="px-3 py-2 hover:bg-accent"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex-1">
            <label className="block text-sm mb-1">列数</label>
            <div className="flex items-center border rounded">
              <button 
                onClick={() => setColNum(Math.max(1, colNum - 1))}
                className="px-3 py-2 hover:bg-accent"
              >
                -
              </button>
              <input 
                type="number" 
                value={colNum} 
                onChange={e => setColNum(Math.max(1, Math.min(10, parseInt(e.target.value) || 1)))}
                className="w-full text-center bg-transparent focus:outline-none"
              />
              <button 
                onClick={() => setColNum(Math.min(10, colNum + 1))}
                className="px-3 py-2 hover:bg-accent"
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        {/* Table preview */}
        <div className="border rounded p-2 space-y-2 max-h-60 overflow-auto mb-4">
          {Array.from({ length: rowNum + 1 }, (_, row) => (
            <div key={row} className="flex gap-2">
              {Array.from({ length: colNum }, (_, col) => (
                <input
                  key={col}
                  value={tableData[`k_${row}_${col}`] || ''}
                  onChange={e => handleInputChange(`k_${row}_${col}`, e.target.value)}
                  placeholder={row === 0 ? '表头' : ''}
                  className={`flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-primary ${
                    row === 0 ? 'bg-muted' : ''
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            onClick={toggleShowInsertFormDialog}
            className="px-4 py-2 text-sm border rounded hover:bg-accent transition-colors"
          >
            取消
          </button>
          <button
            onClick={insertTable}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  )
}
