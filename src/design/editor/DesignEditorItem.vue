<template>
    <div :class="[`${prefix}segi-design-editor-item`, className]" ref="editor">
        <div v-if="disabled" :class="`${prefix}-design__disabled-mask`">
        </div>
        <slot></slot>
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
