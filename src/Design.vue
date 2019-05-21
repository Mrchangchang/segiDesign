/**
 * 设计文档
 *
 * 预览
 * `DesignPreview` 组件是整个预览块的包裹层，负责渲染左侧预览的框架。`DesignPreview` 和 `config`
 * 子组件是相关的，`config` 组件是知道 `DesignPreview` 的存在的；而 `DesignPreview` 的渲染是
 * 根据 `config` 生成的数据进行的。
 * ⚠️注意：`config` 自身有相应的负责渲染预览的模块，这个和 `DesignPreview` 不冲突，可以理解成
 * `config` 可以控制一些预览界面的全局样式。

 * 预览界面中按模块分成很多区域，每个区域是一个 `DesignPreviewItem`，默认的 `DesignPreviewItem`
 * 实现可以由外部覆盖。负责每个区域的事件交互的是另一个组件 `DesignPreviewController`，这个组件
 * 负责处理添加、删除、编辑、选中以及拖拽操作，`DesignPreviewController` 的实现也是可以由外部覆盖的。
 * ⚠️注意：重写的时候所有交互都需要再这个组件里面处理。`DesignPreviewController` 内部会渲染该区域
 * 对应组件的预览模块，预览模块有两个参数：`value` 和 `design`。`value` 是当前的值，`design` 是
 *  `Design` 组件提供的一些操作，一般用不到。

 * 编辑
 * `DesignEditorItem` 是每个区域对应的编辑区域，这个区域的显示隐藏由 `Design` 控制。`DesignEditorItem`
 * 可以由外部覆盖重写。

 * `DesignEditorAddComponent` 这个组件负责枚举所有**可以添加的组件**，暂不支持由外部自定义组件实现。

 * `DesignEditor` 是所有编辑组件的基类，这个类提供了一些常用的方法（例如 `onChange` 事件的处理函数），
 * 在子类里面可以直接使用。
 */
<template>
  <div :class="[`${prefix}-design`, className]"></div>
</template>
<script>
import {
  assign,
  find,
  findIndex,
  isEmpty,
  isUndefined,
  defaultTo,
  isFunction
} from "lodash";
import * as storage from "zent/es/utils/storage";
import uuid from "./utils/uuid";
import { Alert } from "ant-design-vue";
class Component {
  constructor() {}
}
const UUID_KEY = "__zent-design-uuid__";
const CACHE_KEY = "__zent-design-cache-storage__";
export default {
  components: {
    Alert
  },
  props: {
    components: {
      type: Array,
      validator(value) {
        if (value) {
          value.every(v => v instanceof Component);
        } else {
          return false;
        }
      }
    },
    value: {
        type: Array,
        default: () => []
    },
    // Design 组件通用的全局设置
    settings: Object,
    // 默认选中的组件下标
    defaultSelectedIndex: {
        type: Number,
        default: -1
    },
    // onChange(value: object)
    onChange: Function,
    // 用来渲染整个 Design 组件
    preview: Function,
    // 预览部分底部的额外信息
    previewFooter: Object,
    // 有未保存数据关闭窗口时需要用户确认
    // 离开时的确认文案新版本的浏览器是不能自定义的
    confirmUnsavedLeave: {
        type: Boolean,
        default: true
    },
    // 是否将未保存的数据暂存到 localStorage 中
    // 下次打开时如果有未保存的数据会提示从 localStorage 中恢复
    // 这个 props 不支持动态修改，只会在 mount 的时候检查一次状态
    cache: {
        type: Boolean,
        default: false 
    },
    // Design 实例的缓存 id，根据这个 id 识别缓存
    cacheId: String,
    // 恢复缓存时的提示文案
    cacheRestoreMessage: {
        type: String,
        default: '提示：在浏览器中发现未提交的内容，是否使用该内容替换当前内容？'
    },
    // 是否禁用编辑功能
    // 开启后，会忽略 components 里面的 editable 设置，全部不可编辑
    disabled: Boolean,
    // 一些用户自定义的全局配置
    globalConfig: {
        type: Object,
        default: () => Object
    },
    // 滚动到顶部时的偏移量
    scrollTopOffset: {
        type: [Number, Function],
        default: -10
    },
    // 滚动到左侧时的偏移量
    scrollLeftOffset: {
        type: [Number, Function],
        default: -10
    },
    children: Object,
    className: String,
    prefix: {
        type: String,
        default: 'segi'
    }
  },
  data() {
    return {
      selectedUUID
    };
  },
  methods: {
    getUUIDFromValue(value) {
      return value && value[UUID_KEY];
    }
  }
};
</script>

