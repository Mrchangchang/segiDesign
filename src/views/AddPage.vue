<template>
  <div>
    <h4>新增微页面</h4>
    <Design :cache="true" 
    cacheId="zent-design-test"
    :confirmUnsavedLeave="false"
    :designComponents="grouped ? groupedComponents : designComponents"
    :value="value"
    :onChange="onChange"
    :settings="settings"
    :onSettingsChange="onSettingsChange"
    :scrollTopOffset="-270"
    :globalConfig="global"/>
  </div>
</template>
<script>
import Vue from 'vue'
import Design from '../design/index'
import ConfigEditor from "../components/config/ConfigEditor";
import ConfigPreview from '../components/config/ConfigPreview'
import configConf from "../components/config/index";

const designComponents = [
  Object.assign({}, configConf, {
    // 是否可以拖拽
    dragable: false,
    // 是否出现在底部的添加组件区域
    appendable: false,
    // 是否可以编辑，UMP里面有些地方config是不能编辑的
    // editable: true,
    configurable: false,
    highlightWhenSelect: false
  })
];

const groupedComponents = [
  Object.assign({}, configConf,{
    // 是否可以拖拽
    dragable: false,
    // 是否出现在底部的添加组件区域
    appendable: false,
    // 是否可以编辑，UMP里面有些地方config是不能编辑的
    // editable: true,
    configurable: false,
    highlightWhenSelect: false
  }),
  Design.group('基础')
]

Vue.component(ConfigEditor.name, ConfigEditor) // 全局注册
Vue.component(ConfigEditor.name, ConfigEditor )
export default {
  components: {
    Design
  },
  data() {
    return {
      grouped: true,
      value: [
        {
          type: configConf.type,
          ...ConfigEditor.getInitialValue()
        }
      ],
      settings: {

      },
      global: window._global || {},
      groupedComponents,
      designComponents
    };
  },
  methods: {
    onChange(newValue) {
      this.value = newValue
    },
    onSettingsChange (newSettings) {
      this.settings = newSettings
    },
    switchMode() {
      this.grouped = !this.grouped
    }
  }
};
</script>
