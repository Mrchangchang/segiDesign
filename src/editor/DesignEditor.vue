<template>
  <div :class="[`${prefix}-design-editor-item`, className]">
    <div v-if="disabled" :class="`${prefix}-design__disabled-mask`"></div>
  </div>
</template>
<script>
import reorder from "../utils/reorder.js";
import shallowEqual from "../utils/shallowEqual.js";

const NOT_EVENT_MSG =
  "onInputChange expects an `Event` with { target: { name, value } } as argument";
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
  },
  data() {
    return {
      // 组件的类型
      designType: "unknown",
      // 组件的描述
      designDescription: "未知的组件"
      // 添加组件实例时的初始值
    };
  },
  created() {
    this.validateValue();
  },
  methods: {
    // value 的验证函数
    validate(value, prevValue, changedProps) {
      return new Promise(resolve => resolve({}));
    },
    // 添加组件实例时的初始值
    getInitialValue() {
      return {};
    }
  },
  /**
   * 通用的 Input 元素 onChange 回调函数
   *
   * 适用于 Input, Checkbox, Select, Radio
   */
  onInputChange(evt) {
    if (!isEventLikeObject(evt)) {
      throw new Error(NOT_EVENT_MSG);
    }
    const { onChange } = this;
    const { target } = evt;
    const { name, type } = target;
    let { value } = target;
    if (type === "checkbox") {
      value = target.checked;
    }
    onChange({
      [name]: value
    });
    this.setMetaProperty(name, "dirty");
  },
  /**
   * 有些组件的 onChange 事件抛出来的不是 Event 对象
   *
   * 适用于 Slider, Switch, DatePicker 以及其它自定义组件
   */
  onCustomInputChange(name) {
    return value => {
      const { onChange } = this;
      onChange({ [name]: value });
      this.setMetaProperty(name, "dirty");
    };
  },
  /**
   * 处理 Input 元素的 blur 事件。
   */
  onInputBlur(evt) {
    if (!isEventLikeObject(evt)) {
      throw new Error(NOT_EVENT_MSG);
    }
    const {
      target: { name }
    } = evt;
    this.onCustomInputBlur(name);
  }
};
</script>