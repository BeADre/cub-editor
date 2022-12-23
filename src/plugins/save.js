import shortcut from '../core/shortcut.js'

export default function savePlugin() {
  let isInit = false

  return {
    handlers: {
      keydown(editor, event) {
        if (shortcut('Mod+S', event)) {
          window.localStorage.setItem('CUB_EDITOR_SAVED_VALUE', editor.value)

          const title = document.title
          if (title.startsWith('* ')) {
            document.title = title.replace('* ', '')
          }

          event.preventDefault()
        }
      }
    },
    afterchange() {
      if (!isInit) {
        isInit = true
        return
      }

      const title = document.title

      if (!title.startsWith('* ')) {
        document.title = `* ${title}`
      }
    }
  }
}
