import Editor from './core/editor.js'
import renderer from './renderer/index.js'
import styles from './renderer/styles.module.css'
import parser from './parser/block/index.js'
import enterPlugin from './plugins/enter.js'
import backspacePlugin from './plugins/backspace.js'
import tabPlugin from './plugins/tab.js'
import historyPlugin from './plugins/history.js'
import highlightPlugin from './plugins/highlight.js'
import formatPlugin from './plugins/format.js'
import orderedListPlugin from './plugins/ordered-list.js'
import dropPlugin from './plugins/drop.js'
import savePlugin from './plugins/save.js'

export default class DefaultEditor extends Editor {
  constructor({ element, value } = {}) {
    element.classList.add(styles.editor)

    const plugins = [
      enterPlugin(),
      backspacePlugin(),
      tabPlugin(),
      savePlugin(),
      historyPlugin(),
      highlightPlugin(),
      formatPlugin(),
      orderedListPlugin(),
      dropPlugin()
    ]

    super({ element, value, plugins, renderer, parser })
  }
}
