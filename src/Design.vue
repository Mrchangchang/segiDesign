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
  <div :class="[`${prefix}-design`, className]" :style="{ paddingBottom: bottomGap }">
    <Alert :class="`${prefix}-design__restore-cache-alert`" @click.native="restoreCache" banner :message="cacheRestoreMessage" closable @close="onRestoreCacheAlertClose">
      <DesignPreview :prefix="prefix"
       :components="components" 
       :value="value"
       :validations="validations"
       :showError="showError"
       :settings="settings || managedSettings"
       :onSettingsChange="onSettingsChange"
       :footer="previewFooter"
       :componentInstanceCount="componentInstanceCount"
       :onComponentValueChange="onComponentValueChange"
       :onAddComponent="onAdd"
       :appendableComponents="appendableComponents"
       :selectedUUID="selectedUUID"
       :getUUIDFromValue="getUUIDFromValue"
       :showAddComponentOverlay="showAddComponentOverlay"
       :addComponentOverlayPosition="onShowAddComponentOverlay"
       :onShowEditComponentOverlay="onShowEditComponentOverlay",
       :onSelect="onSelect"
       :onMove="onMove"
       :onDelete="onDelete"
       :globalConfig="globalConfig"
       :disabled="{}"
       ref="savePreview"
      > </DesignPreview>
    </Alert>
  </div>
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
import DesignPreview from './preview/DesignPreview'
class Component {
  constructor() {}
}
const UUID_KEY = "__zent-design-uuid__";
const CACHE_KEY = "__zent-design-cache-storage__";

function tagValuesWithUUID(values) {
  values.forEach(v => {
    if (!v[UUID_KEY]) {
      v[UUID_KEY] = uuid();
    }
  });
}

function getSafeSelectedValueIndex(index, value) {
  return Math.min(index, value.length - 1);
}


/**
 * 根据当前的值生成一个组件使用计数
 * @param {Array} value Design 当前的值
 * @param {Array} components Design 支持的组件列表
 */
function makeInstanceCountMapFromValue(value, components) {
  const instanceCountMap = new LazyMap(0);

  (value || []).forEach(val => {
    const comp = find(components, c => isExpectedDesignType(c, val.type));
    instanceCountMap.inc(serializeDesignType(comp.type));
  });

  return instanceCountMap;
}

const safeValueIndex = getSafeSelectedValueIndex(defaultSelectedIndex, value);

const selectedValue = value[safeValueIndex];

export default {
  components: {
    Alert,DesignPreview
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
      default: "提示：在浏览器中发现未提交的内容，是否使用该内容替换当前内容？"
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
      default: "segi"
    }
  },
  data() {
    return {
      // 当前选中的组件对应的 UUID
      selectedUUID: '',
      // 外面没传的时候用 state 上的 settings
      settings: {},
       // 是否显示添加组件的浮层
      showAddComponentOverlay: false,
       // 是否显示添加组件的浮层
      showAddComponentOverlay: false,
      // 添加组件浮层的位置
      addComponentOverlayPosition: ADD_COMPONENT_OVERLAY_POSITION.UNKNOWN,

      // 可添加的组件列表
      appendableComponents: [],

      // 当前所有组件的 validation 信息
      // key 是 value 的 UUID
      validations: {},

      // 是否强制显示错误
      showError: false,

      // 是否显示从缓存中恢复的提示
      showRestoreFromCache: false,

      // 当 preview 很长时，为了对齐 preview 底部需要的额外空间
      bottomGap: 0,
    };
  },
  computed: {
    // 当前选中的组件对应的 UUID
    selectedUUID() {
      const safeValueIndex = getSafeSelectedValueIndex(
        this.defaultSelectedIndex,
        this.value
      );
      const selectedValue = value[safeValueIndex]
      return this.getUUIDFromValue(selectedValue)
    },
    // 每个组件当前已经添加的个数
    componentInstanceCount () {
      makeInstanceCountMapFromValue(this.value, this.components)
    }
    
  },
  created () {
    this.validateCacheProps(this.$props)
    tagValuesWithUUID(this.value)
  },
  methods: {
    getUUIDFromValue(value) {
      return value && value[UUID_KEY];
    }
  },
  // 缓存相关的函数
  validateCacheProps (props) {
    props = props || this.props;
    const { cache, cacheId } = props;
    if (cache && !cacheId) {
      throw new Error('Design: cacheId is required when cache is on');
    }
  }
};
</script>

