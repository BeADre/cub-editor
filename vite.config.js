import fs from 'fs'
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
            build.onLoad({ filter: /src\/.*\.js$/ },  (args) => ({
              loader: 'jsx',
              contents: fs.readFileSync(args.path, 'utf8')
            }))
          }
        }
      ],
      loader: {
        '.js': 'jsx'
      }
    }
  },
  plugins: [removeConsole()]
}))
