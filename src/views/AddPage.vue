<template>
  <div>新增微页面</div>
</template>
<script>
import ConfigEditor from "../components/config/ConfigEditor";
import configConf from "../components/config/index";

const components = [
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
console.info(ConfigEditor)
export default {
  components: {
    ConfigEditor
  },
  data() {
    return {};
  }
};
</script>
