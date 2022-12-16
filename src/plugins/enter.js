import {
  serializeState,
  orderedSelection,
  replaceSelection
} from '../core/shared.js'

const PREFIXES = {
  blockquote: '> ',
  unordered_list_item: '- ',
  ordered_list_item: str => `${parseInt(str) + 1}. `,
  todo_item: '- [ ] '
}

const EMPTY_LENGTHS = {
  blockquote: 2,
  unordered_list_item: 3,
  ordered_list_item: 4,
  todo_item: 3
}

function getPrefix(block) {
  if (!Object.keys(PREFIXES).includes(block.type)) return ''

  // No indentation
  if (block.type === 'blockquote') return PREFIXES.blockquote

  const text = typeof PREFIXES[block.type] === 'function' ?
    PREFIXES[block.type](block.content[1]) :
    PREFIXES[block.type]

  return block.content[0] + text
}

function shouldRemoveBlock(block) {
  const len = EMPTY_LENGTHS[block.type]
  return block.content.length === len && block.content[len - 1] === ' '
}

export default function enterPlugin() {
  return {
    handlers: {
      keypress(editor, event) {
        // Enter
        if (event.which !== 13) return

        event.preventDefault()

        const { firstBlock, firstOffset } = orderedSelection(editor.selection)
        const firstLine = serializeState(editor.state[firstBlock].content)
        const { isCollapsed } = editor.element.getRootNode().getSelection()

        // Remove empty block
        if (
          isCollapsed &&
          firstOffset === firstLine.length &&
          Object.keys(PREFIXES).includes(editor.state[firstBlock].type) &&
          shouldRemoveBlock(editor.state[firstBlock])
        ) {
          let parserValue = ''
          const { content, type } = editor.state[firstBlock]
          const tabLength = content[0].split('\t').length - 1

          if (tabLength > 1) {
            let block = firstBlock
            while (block > 1) {
              block -= 1
              const { content: prevContent, type: prevType } = editor.state[block]

              if (prevType !== type) continue

              const prevTabLength = prevContent[0].split('\t').length - 1

              if (prevTabLength === tabLength - 1) {
                const newContent = [...prevContent]
                newContent.splice(prevContent.length - 1, 1, ' ')

                if (type === 'ordered_list_item') newContent[1] = +prevContent[1] + 1

                newContent[0] = Array(prevTabLength).fill('\t').join('')
                parserValue = newContent.join('')
                break
              }
            }
          }

          editor.update([
            ...editor.state.slice(0, firstBlock),
            // Generate block from empty line
            editor.parser(parserValue).next().value,
            ...editor.state.slice(firstBlock + 1)
          ], [firstBlock, parserValue.length])

          return true
        }

        const prefix = event.shiftKey || event.altKey || event.ctrlKey ?
          '' : getPrefix(editor.state[firstBlock])
        replaceSelection(editor, '\n' + prefix)

        return true
      }
    }
  }
}
