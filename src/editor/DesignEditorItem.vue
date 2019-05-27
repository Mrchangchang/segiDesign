<template>
    <div :class="[`${prefix}segi-design-editor-item`, className]" ref="editor">
        <div v-if="disable" :class="`${prefix}-design__disabled-mask`">{{children}}</div>
    </div>
</template>

<script>
export default {
    name: 'DesignEditorItem',
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        prefix: {
            type: String,
            default:'segi'
        },
        className: String,
        children: Object
    },
    methods: {
        getBoundingBox() {
            const node = this.$refs.editor
            return node && node.getBoundingClientRect()
        }
    }
}
</script>
