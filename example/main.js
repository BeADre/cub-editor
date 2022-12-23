import DefaultEditor from '../src/index.js'
import defaultValue from './value.js'
// import { set as setFileURL } from '../src/renderer/files.js'

// setFileURL(
//   '5457B1BB-5EB1-41D8-8C5B-85B4522A8162-62139-000178299718391D',
//   'cub.jpg'
// )
// setFileURL(
//   '999F2B01-AD94-4FE3-923E-B39C7C51962C-16057-00005A56C2010437',
//   URL.createObjectURL(new File([value], 'Writing on the web.md'))
// )

const value = window.localStorage.getItem('CUB_EDITOR_SAVED_VALUE') || defaultValue

const element = document.querySelector('#editor')
window.editor = new DefaultEditor({ element, value })
