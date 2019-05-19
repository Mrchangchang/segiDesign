<template>
    <div :class="[`${prefix}segi-design-editor-item`, className]">
        <div v-if="disable"></div>
    </div>
</template>

<script>
export default {
    name: 'DesignEditorItem',
    props: {
        disabled: Boolean,
        prefix: String,
        className: String
    }
}
</script>
