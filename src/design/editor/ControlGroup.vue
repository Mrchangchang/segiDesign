<template>
    <div :class="[`${prefix}-design-editor__control-group`,className, errorVisible?'has-error':'']">
        <div :class="`${prefix}-design-editor__control-group-container`" v-if="focusOnLabelClick">
            <div v-if="showLabel" :class="[`${prefix}-design-editor__control-group-label`,
            labelAlign?`${prefix}-design-editor__control-group-label--${labelAlign}`:'']">
                <span v-if="required" :class="`${prefix}-design-editor__control-group-required-star`">
                    *
                </span>
                {{label}}
            </div>
            <div :class="`${prefix}-design-editor__control-group-control`">
                <slot></slot>
                <div v-if="helpDesc" :class="`${prefix}-design-editor__control-group-help-desc`">
                    {{helpDesc}}
                </div>
                <div v-if="errorVisible" :class="`${prefix}-design-editor__control-group-error`">{{error}}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        showError: {
            type: Boolean,
            default: false
        },
        error: {
            type: String,
            default: ''
        },
        showLabel: {
            type: Boolean,
            default: true
        },
        helpDesc: Object,
        label: Object,

        // 自定义label对齐方式
        labelAlign: String,
        // 点击 label 区域时是否 focus 到 control 的 input 上
        focusOnLabelClick: {
            type: Boolean,
            default: true
        },
        required: {
            type: Boolean,
            default: false
        },
        className: String,
        prefix: {
            type: String,
            default: 'segi'
        }
    },
    computed: {
        showError() {
            return this.showError && this.error
        }
    }
}
</script>
