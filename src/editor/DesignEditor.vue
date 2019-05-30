<template>
    <div :class="[`${prefix}-design-editor-item`, className]">
        <div v-if="disabled" :class="`${prefix}-design__disabled-mask`"></div>
    </div>
</template>
<script>
import reorder from '../utils/reorder.js'
import shallowEqual from '../utils/shallowEqual.js';

const NOT_EVENT_MSG =
  'onInputChange expects an `Event` with { target: { name, value } } as argument'
export default {
    props: {
        value: Object,
        onChange: Function,

        // 验证状态
        validation: Object,

        // 是否强制显示所有错误
        showError: Boolean,

        // 用来和 Design 交互
        design: Object,

        // 自定义全局配置，Design 不会改变这个对象的值
        globalConfig: Object,
        // Design 全剧配置，和 globalConfig 的区别是 Design 组件可以 修改 settings 的值
        settings: Object,
        // 修改 settings 的回调函数
        onSettingsChange: Function
    }
}
</script>