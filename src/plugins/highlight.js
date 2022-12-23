import styles from './highlight.module.css'
import { setOffset } from '../core/shared.js'

import Prism from 'prismjs'

// Languages
import 'prismjs/components/prism-c.min.js'
import 'prismjs/components/prism-cpp.min.js'
import 'prismjs/components/prism-css.min.js'
import 'prismjs/components/prism-dart.min.js'
import 'prismjs/components/prism-go.min.js'
import 'prismjs/components/prism-java.min.js'
import 'prismjs/components/prism-javascript.min.js'
import 'prismjs/components/prism-typescript.min.js'
import 'prismjs/components/prism-json.min.js'
import 'prismjs/components/prism-php.min.js'
import 'prismjs/components/prism-python.min.js'
import 'prismjs/components/prism-bash.min.js'
import 'prismjs/components/prism-sql.min.js'
import 'prismjs/components/prism-swift.min.js'

// Language aliases
Object.assign(Prism.languages, {
  'c++': Prism.languages.cpp,
  'c#': Prism.languages.csharp,
  golang: Prism.languages.go,
  py: Prism.languages.python,
  sh: Prism.languages.bash,
  shell: Prism.languages.bash,
  js: Prism.languages.javascript,
  ts: Prism.languages.typescript
})

/**
 * @typedef Token
 * @property {String} type
 * @property {String|Token|Array<Token|String>} content
 */

/**
 * @param {Token} token
 * @returns {Node}
 */
function tokenToNode(token) {
  if (typeof token === 'string') return token

  const content = Array.isArray(token.content) ?
    token.content.map(tokenToNode) :
    [tokenToNode(token.content)]

  const node = document.createElement('span')
  const className = styles[token.type.trim()]
  if (className) node.className = className
  node.append(...content)

  return node
}

const TIMEOUT = 500

export default function highlightPlugin() {
  let cb

  return {
    afterchange(editor) {
      if (cb) clearTimeout(cb)

      // Wait until typing has stopped
      cb = setTimeout(() => {
        cb = undefined

        for (const block of editor.state) {
          if (block.type !== 'code_block') continue

          const index = editor.state.indexOf(block)
          const { content: [, language, , code] } = block

          const blockNode = editor.element.children[index]
          // Already highlighted
          if (blockNode.childNodes.length !== 6) continue

          const grammar = Prism.languages[language.trim()]
          if (!grammar) continue

          const {
            anchorBlock,
            anchorOffset,
            focusBlock,
            focusOffset
          } = editor.selection

          const tokens = Prism.tokenize(code, grammar)
          const frag = document.createDocumentFragment()
          frag.append(...tokens.map(tokenToNode))

          blockNode.childNodes[3].replaceWith(frag)

          if (anchorOffset !== -1) {
            setOffset(editor, {
              anchor: [anchorBlock, anchorOffset],
              focus: [focusBlock, focusOffset]
            })
          }
        }
      }, TIMEOUT)

    }
  }
}
