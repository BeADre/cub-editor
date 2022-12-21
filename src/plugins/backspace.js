export default function backspacePlugin() {
  return {
    handlers: {
      keydown(editor, event) {
        if (event.key === 'Backspace') {
          const children = editor.element.children
          if (
            children.length === 1 &&
            children[0].tagName === 'P' &&
            (children[0].innerHTML === '<br>' || children[0].innerHTML === '')
          ) {
            event.preventDefault()
          }
        }
      }
    }
  }
}
