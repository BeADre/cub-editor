import fs from 'fs/promises'
import { defineConfig } from 'vite'
import removeConsole from 'vite-plugin-remove-console'

export default defineConfig(() => ({
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: []
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad({ filter: /src\/.*\.js$/ }, async (args) => ({
              loader: 'jsx',
              contents: await fs.readFile(args.path, 'utf8')
            }))
          }
        }
      ]
    }
  },
  plugins: [removeConsole()]
}))
