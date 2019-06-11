import Editor from './ConfigEditor.vue'
import Preview from './ConfigPreview.vue'
// Editor.designType = 'config'
export default {
    type: Editor.designType,
    editor: Editor,
    preview: Preview
}