<template>
  <div :class="[`${prefix}-design-editor-item`, className]">
    <div v-if="disabled" :class="`${prefix}-design__disabled-mask`"></div>
  </div>
</template>
<script>
import reorder from "../utils/reorder.js";
import shallowEqual from "../utils/shallowEqual.js";

function isEventLikeObject(evt) {
  return (
    evt &&
    evt.target &&
    evt.target.name &&
    evt.preventDefault &&
    evt.stopPropagation
  );
}

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
  computed: {
    errorVisible() {
      return this.showError && this.error;
    }
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
    },
    /**
     * 有些组件没有 onBlur 事件，用这个函数处理
     */
    onCustomInputBlur(name) {
      this.setMetaProperty(name, "touched");
      this.validateValue();
    },
    /**
     * 获取 Field 的 meta 属性，包括 dirty, touched 等
     * @param {string} name Field 名字
     * @param {string} property meta 属性名字
     */
    getMetaProperty(name, property) {
      const { meta } = this;
      return !!(meta && meta[name] && meta[name][property]);
    },
    /**
     * 设置 Field 的 meta 属性
     * @param {string} name Field 名字
     * @param {string} property meta 属性名字
     * @param {any} state 属性的值
     */
    setMetaProperty(name, property, state = true) {
      const { meta } = this;
      const states = meta[name];
      if (!states || states[property] !== state) {
        this.$set(
          this,
          "meta",
          assign({}, meta, {
            [name]: assign({}, states, { [property]: state })
          })
        );
      }
    },
    /**
     * 返回表单是否有错误
     */
    isValid() {
      const { validation } = this;
      return Object.keys(validation).length > 0;
    },
    isInvalid() {
      return !this.isValid();
    },

    /**
     * 触发一次表单校验
     */
    validateValue() {
      const { value, design } = this;
      design.validateComponentValue(value, value, []).then(errors => {
        const id = design.getUUID(value);
        design.setValidation({ [id]: errors });
      });
    },

    /*
     * Utility to reorder list for react-beautiful-dnd
     * Scans the list only once.
     */
    reorder(array, fromIndex, toIndex) {
      return reorder(array, fromIndex, toIndex);
    },
    shouldComponentUpdate(nextProps, nextState) {
      return (
        !shallowEqual(this.props, nextProps) ||
        !shallowEqual(this.state, nextState)
      );
    }
  }

  /**
   * 表单每个域的基础样式
   */
};
</script>