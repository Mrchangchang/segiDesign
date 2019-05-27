<template>
    <div :class="[`${prefix}-design-editor-item`, className]">
        <div v-if="disabled" :class="`${prefix}-design__disabled-mask`"></div>
    </div>
</template>
