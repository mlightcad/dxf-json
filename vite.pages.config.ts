import { resolve } from 'node:path'
import { defineConfig } from 'vite'

const basePath = process.env.PAGES_BASE_PATH ?? '/'
const normalizedBasePath = basePath.endsWith('/') ? basePath : `${basePath}/`

export default defineConfig({
  base: normalizedBasePath,
  build: {
    outDir: 'pages-dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        viewer: resolve(__dirname, 'examples/dxf_json_viewer.html'),
      },
    },
  },
})
