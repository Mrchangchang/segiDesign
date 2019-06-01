<template>
  <div :class="`${prefix}-design-component-config-editor`">
    <ControlGroup
      :showError="showError || getMetaProperty('title', 'touched')"
      :error="validation.titles"
      required
      label="页面名称:"
    >
      <AInput :value="value.title" @change="onInputChange" @blur="onInputBlur" name="title"></AInput>
    </ControlGroup>
    <ControlGroup
      :showError="showError || this.getMetaProperty('description', 'touched')"
      label="页面描述:"
    >
      <AInput
        :value="value.description"
        @change="onInputChange"
        @blur="onInputBlur"
        name="description"
      ></AInput>
    </ControlGroup>
    <ControlGroup
      label="背景颜色:"
      labelAlign="top"
      :focusOnLabelClick="false"
      :class="`${prefix}-design-component-config-editor__background`"
    >
      <div :class="`${prefix}-design-component-config-editor__background-control`">
        <colorPicker :value="getBackground(value, settings)" @change="onBackgroundChange"/>
        <a href="javascript:;" @click="resetBackground">重置</a>
        <div :class="`${prefix}-design-component-config-editor__background-hint`">背景颜色只在手机端显示</div>
      </div>
    </ControlGroup>
  </div>
</template>
<script>
import DesigEditor from "../../design/editor/DesignEditor";
import ControlGroup from "../../design/editor/ControlGroup";
import { DEFAULT_BACKGROUND } from "../../design/preview/constants";
import { Input } from "ant-design-vue";
import { Promise } from 'q';

export default {
  designType: "config", // 静态属性
  designDescription: "页面配置",
  extends: DesigEditor,
  components: {
    ControlGroup,
    AInput: Input
  },
  data() {
    return {
      designType: "config",
      
    };
  },
  created() {
    this.onColorChange = this.onCustomInputChange("color")
  },
  methods: {
    // onColorChange: this.onCustomInputChange("color"),
    onBackgroundChange(color) {
      // 修改 Config 组件的值
      this.onColorChange(color);
      // 修改 settings
      this.onSettingsChange({
        previewBackground: color
      });
    },
    resetBackground() {
      this.onBackgroundChange(DEFAULT_BACKGROUND);
    },
    filterTag: (item, keyword) => item.text.indexOf(keyword) > -1,
    getInitialValue() {
      return {
        // 标题
        title: "微页面标题",

        //  背景颜色
        color: "",

        // 页面描述
        description: ""
      };
    },
    validate(value) {
      return new Promise(resolve => {
        const errors = {}
        const { title } = value
        if (!title || !title.trim()) {
          errors.title = '请填写页面名称'
        } else if (title.length > 50) {
          errors.title = '页面名称长度不能多于 50 个字'
        }
        resolve(errors)
      })
    },
    getBackground(value, settings) {
      return (value && value.color) || settings.previewBackground || DEFAULT_BACKGROUND 
    }
  }
};
</script>

