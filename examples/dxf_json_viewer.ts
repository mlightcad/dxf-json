import { DxfParser } from '../src/index.ts'

type JsonEditorInstance = {
  set: (value: unknown) => void
  expandAll: () => void
}

type JsonEditorConstructor = new (
  container: HTMLElement,
  options: Record<string, unknown>,
) => JsonEditorInstance

const fileInput = document.getElementById('fileInput')
const status = document.getElementById('status')
const jsonEditorElement = document.getElementById('jsonEditor')

if (!(fileInput instanceof HTMLInputElement)) {
  throw new Error('fileInput element is missing.')
}

if (!(status instanceof HTMLElement)) {
  throw new Error('status element is missing.')
}

if (!(jsonEditorElement instanceof HTMLElement)) {
  throw new Error('jsonEditor element is missing.')
}

const jsonEditorCtor = (window as Window & { JSONEditor?: JsonEditorConstructor }).JSONEditor

if (!jsonEditorCtor) {
  throw new Error('JSONEditor is not loaded.')
}

let editor: JsonEditorInstance | undefined

const setStatus = (message: string, isError = false) => {
  status.textContent = message
  status.classList.toggle('error', isError)
}

const hideEditor = () => {
  jsonEditorElement.hidden = true
}

const getEditor = () => {
  jsonEditorElement.hidden = false

  if (!editor) {
    editor = new jsonEditorCtor(jsonEditorElement, {
      mode: 'view',
      modes: ['view', 'tree', 'code'],
      mainMenuBar: true,
      navigationBar: true,
      statusBar: true,
    })
  }

  return editor
}

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  return `${(size / 1024 / 1024).toFixed(1)} MB`
}

fileInput.addEventListener('change', async (event) => {
  const input = event.target
  const file = input instanceof HTMLInputElement ? input.files?.[0] : undefined

  if (!file) {
    setStatus('No file selected.')
    hideEditor()
    return
  }

  hideEditor()
  setStatus(`Parsing ${file.name} (${formatFileSize(file.size)})...`)

  try {
    const parser = new DxfParser()
    const dxfText = await file.text()
    const result = parser.parseSync(dxfText)
    const jsonEditor = getEditor()
    jsonEditor.set(result)
    jsonEditor.expandAll()
    setStatus(
      `${file.name} parsed: ${result.entities.length} entities, ${Object.keys(result.blocks ?? {}).length} blocks.`,
    )
  } catch (error) {
    console.error('Failed to process DXF file:', error)
    hideEditor()
    setStatus(error instanceof Error ? `Failed to parse DXF: ${error.message}` : 'Failed to parse DXF.', true)
  }
})
