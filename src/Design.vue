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
    <Alert
      :class="`${prefix}-design__restore-cache-alert`"
      @click.native="restoreCache"
      banner
      :message="cacheRestoreMessage"
      closable
      @close="onRestoreCacheAlertClose"
    >
      <DesignPreview
        :prefix="prefix"
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
        :onShowEditComponentOverlay="onShowEditComponentOverlay"
        ,
        :onSelect="onSelect"
        :onMove="onMove"
        :onDelete="onDelete"
        :globalConfig="globalConfig"
        :disabled="{}"
        ref="savePreview"
      ></DesignPreview>
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
import DesignPreview from "./preview/DesignPreview";
import { Promise } from 'q';
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

function tagValuesWithUUID(values) {
  values.forEach(v => {
    if (!v[UUID_KEY]) {
      v[UUID_KEY] = uuid();
    }
  });
}

/**
 * 从 startIndex 开始往前找到第一个可以选中的值
 * @param {array} value 当前的值
 * @param {array} components 当前可用的组件列表
 * @param {number} startIndex 开始搜索的下标
 */
function findFirstEditableSibling(value, components, startIndex) {
  const loop = i => {
    const val = value[i];
    const type = val.type;
    const comp = find(components, c => isExpectedDesignType(c, type));
    if (comp && defaultTo(comp.editable, true)) {
      return val;
    }
  };

  const valueLength = value.length;
  // 往前找
  for (let i = startIndex; i >= 0 && i < valueLength; i--) {
    const val = loop(i);
    if (val) {
      return val;
    }
  }

  // 往后找
  for (let i = startIndex + 1; i < valueLength; i++) {
    const val = loop(i);
    if (val) {
      return val;
    }
  }

  return null;
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

function getSafeSelectedValueIndex(index, value) {
  return Math.min(index, value.length - 1);
}

const safeValueIndex = getSafeSelectedValueIndex(defaultSelectedIndex, value);

const selectedValue = value[safeValueIndex];

export default {
  components: {
    Alert,
    DesignPreview
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
      selectedUUID: "",
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
      bottomGap: 0
    };
  },
  computed: {
    // 当前选中的组件对应的 UUID
    selectedUUID() {
      const safeValueIndex = getSafeSelectedValueIndex(
        this.defaultSelectedIndex,
        this.value
      );
      const selectedValue = value[safeValueIndex];
      return this.getUUIDFromValue(selectedValue);
    },
    // 每个组件当前已经添加的个数
    componentInstanceCount() {
      makeInstanceCountMapFromValue(this.value, this.components);
    }
  },
  created() {
    this.validateCacheProps(this.$props);
    tagValuesWithUUID(this.value);
  },
  methods: {
    getUUIDFromValue(value) {
      return value && value[UUID_KEY];
    },
    // 缓存相关的函数
    validateCacheProps(props) {
      props = props || this.props;
      const { cache, cacheId } = props;
      if (cache && !cacheId) {
        throw new Error("Design: cacheId is required when cache is on");
      }
    },
    onSettingsChange(value) {
      const { settings, onSettingsChange } = this.props;
      const onSettingsChangeExists = isFunction(onSettingsChange);
      if (settings && !onSettingsChangeExists) {
        throw new Error("Expects onSettingsChange to be a function");
      }
      if (settings && onSettingsChangeExists) {
        onSettingsChange({
          ...settings,
          ...value
        });
      }

      if (!settings) {
      }
    },
    onComponentValueChange(identity) {
      return (diff, replace = false) => {
        const { value } = this;
        const newComponentValue = replace
          ? assign({ [UUID_KEY]: this.getUUIDFromValue(identity) }, diff)
          : assign({}, identity, diff);
        const newValue = value.map(v =>
          v === identity ? newComponentValue : v
        );
        const changedProps = Object.keys(diff);
      };
    },
    // 调用 onChange 的统一入口，用于处理一些需要知道有没有修改过值的情况
    trackValueChange(newValue, writeCache = true) {
      const { onChange } = this;
      if (!this._dirty) {
        this._dirty = true;
      }
      if (writeCache) {
        this.writeCache(newValue);
      }
      this.adjustHeight();
    },
    writeCache(value) {
      let { cache } = this;
      if (!cache) {
        return;
      }
      const { cacheId } = this;
      return storage.write(CACHE_KEY, cacheId, value);
    },
    // 调整 Design 的高度，因为 editor 是 position: absolute 的，所以需要动态的更新
    // 实际并未改变高度，而是设置了margin/padding
    adjustHeight(id) {
      // 不要重复执行
      if (this.adjustHeightTimer) {
        clearTimeout(this.adjustHeightTimer);
        this.adjustHeightTimer = undefined;
      }
      this.adjustHeightTimer = setTimeout(() => {
        id = id || this.selectedUUID;
        if (this.preview && this.preview.getEditorBoundingBox) {
          const editorBB = this.preview.getEditorBoundingBox(id);
        }
      });
    },
    validateComponentValue(value, prevValue, changedProps) {
      const { type } = value;
      const { components } = this;
      const comp = find(components, c => isExpectedDesignType(c, type));
      const { validate } = comp.editor;
      const p = validate(value, prevValue, changedProps);
      return p;
    },
    // 打开右侧添加新组件的弹层
    onShowAddComponentOverlay(component, addPosition) {
      this.toggleEditOrAdd(component, true, addPosition);
    },
    // 编辑一个已有组件
    onShowEditComponentOverlay(component) {
      this.toggleEditOrAdd(component, false);
      // 将当前组件滚动到顶部
      const id = this.getUUIDFromValue(component);
      this.scrollToPreviewItem(id);
    },
    // 选中一个组件
    onSelect(component) {
      const id = this.getUUIDFromValue(component);
      if (this.isSelected(component) && !this.showAddComponentOverlay) {
        return;
      }
      this.selectedUUID = id;
      this.showAddComponentOverlay = false;
      this.adjustHeight();
    },
    // 添加一个新组件
    onAdd(component, fromSelected) {
      const { value, settings, globalConfig } = this;
      const { editor, defaultType } = component;
      const instance = editor.getInitialValue({
        settings,
        globalConfig
      });
      instance.type = getDesignType(editor, defaultType);
      const id = uuid();
      this.setUUIDForValue(instance, id);
      /**
       * 添加有两种来源：底部区域或者弹层。
       * 如果来自底部的话，就在当前数组最后加；如果来自弹层就在当前选中的那个组件后面加
       */
      let newValue;
      if (fromSelected) {
        newValue = value.slice();
        const { addComponentOverlayPosition } = this;
        const { selectedUUID } = this;
        const selectedIndex = findIndex(value, { [UUID_KEY]: selectedUUID });
        // 两种位置，插入到当前选中的前面或者后面
        const delta =
          addComponentOverlayPosition === ADD_COMPONENT_OVERLAY_POSITION.TOP
            ? 0
            : 1;
        newValue.splice(selectedIndex + delta, 0, instance);
      } else {
        newValue = value.concat(instance);
      }
      this.trackValueChange(newValue);
      this.onSelect(instance);
    },
    // 删除一个组件
    onDelete(component) {
      const { value, components } = this;
      let nextIndex = -1;
      const newValue = value.filter((v, idx) => {
        const skip = v !== component;
        if (!skip) {
          nextIndex = idx - 1;
        }
        return skip;
      });
      const newState = {
        showAddComponentOverlay: false
      };
      // 删除选中项目后默认选中前一项可选的，如果不存在则往后找一个可选项
      const componentUUID = this.getUUIDFromValue(component);
      if (componentUUID === this.state.selectedUUID) {
        const nextSelectedValue = findFirstEditableSibling(
          newValue,
          components,
          nextIndex
        );
        const nextUUID = this.getUUIDFromValue(nextSelectedValue);
        newState.selectedUUID = nextUUID;
      }
      this.trackValueChange(newValue);
      this.showAddComponentOverlay = false;
      this.adjustHeight();
    },
    onMove(fromIndex, toIndex) {
      if (fromIndex === toIndex) {
        return;
      }
      const { value, components } = this;
      const newValue = [];
      let tmp;
      /**
       * 这个算法不是仅仅交换两个位置的节点，所有中间节点都需要移位
       * 需要考虑数组中间有不可拖拽节点的情况，这种情况下 fromIndex, toIndex 的值是不包括这些节点的
       * 例如 [1, 0, 0, 1, 0, 0, 1]: fromIndex = 0, toIndex = 1 表示移动第一个和第二个 1。
       */
      let passedFromIndex = false;
      let passedToIndex = false;
      if (fromIndex < toIndex) {
        for (let i = 0, dragableIndex = -1; i < value.length; i++) {
          const val = value[i];

          const comp = find(components, c => isExpectedDesignType(c, val.type));
          const dragable = comp && defaultTo(comp.dragable, true);

          if (dragable) {
            dragableIndex++;
          }
          /* Invariant: Each step copies one value, except one copies 2 and another doesn't copy */
          if (dragableIndex === fromIndex && !passedFromIndex) {
            tmp = val;
            passedFromIndex = true;
          } else if (dragableIndex < toIndex && passedFromIndex) {
            newValue[i - 1] = val;
          } else if (dragableIndex === toIndex && !passedToIndex) {
            newValue[i - 1] = val;
            newValue[i] = tmp;
            passedToIndex = true;
          } else {
            newValue[i] = val;
          }
        }
      } else {
        let toInsetIndex;
        for (let i = 0, dragableIndex = -1; i < value.length; i++) {
          const val = value[i];
          const comp = find(components, c => isExpectedDesignType(c, val.type));
          const dragable = comp && defaultTo(comp.dragable, true);
          if (dragable) {
            dragableIndex++;
          }
          /* Invariant: each step copies one value */
          if (dragableIndex === toIndex && !passedToIndex) {
            toInsetIndex = i;
            newValue[i + 1] = val;
            passedToIndex = true;
          } else if (dragableIndex < fromIndex && passedToIndex) {
            newValue[i + 1] = val;
          } else if (dragableIndex === fromIndex && !passedFromIndex) {
            newValue[toInsetIndex] = val;
            passedFromIndex = true;
          } else {
            newValue[i] = val;
          }
        }
      }
      this.trackValueChange(newValue)
    },
    setValidation = validation => {
      this.$set(
        this,
        validations,
        assign({}, this.state.validations, validation)
      )

      this.adjustHeight();
    },
    // 验证所有组件，如果有错误选中并跳转到第一个有错误的组件。
    // 如果没有错误，Promise resolve；如果有错误，Promise reject。
    // reject 的是个数组，
    // [
    //   { '508516bf-d3e5-40a5-812e-834d3dee1d54': {} },
    //   { 'c7c72599-2ac5-41bb-9ba0-45e8178ff5a6': { content: '请填写公告内容' } }
    // ]
    validate () {
      const { value, components } = this
      let _this = this

      return new Promise((resolve, reject) => {
        Promise.all(
          value.map(v => {
            const id = this.getUUIDFromValue(v);
            const { type } = v;
            const comp = find(components, c => isExpectedDesignType(c, type));
            // 假如组件设置了 editable: false，不处罚校验
            if (!defaultTo(comp.editable, true)) {
              return Promise.resolve({ [id]: {} });
            }

            return this.validateComponentValue(v, v, {}).then(errors => {
              return { [id]: errors };
            });
          })
        ).then(validationList => {
          const validations = assign({}, ...validationList)

          _this.showError = true
          _this.validations = validations
          // 跳转到第一个有错误的组件
          const firstError = find(validationList, hasValidateError)
          if (firstError) {
            const id = Object.keys(firstError)[0]
            this.scrollToPreviewItem(id)
            // 选中第一个有错误的组件
            _this.selectedUUID = id
            _this.showAddComponentOverlay = false
            _this.adjustHeight()
            // 过滤所有错误信息，将数组合并为一个对象，key 是每个组件的 id
            const validationErrors = validationList.filter(hasValidateError)
            const hasError = !isEmpty(validationErrors)
            if (!hasError) {
              resolve()
            } else {
              validationErrors.reduce((err, v) => {
                const key = Object.keys(v)[0]
                if (key) {
                  err[key] = v[key]
                }
                return err
              }, {})
            }
          }
        })
      })
    },
    // 保存数据后请调用这个函数通知组件数据已经保存
    markAsSaved () {
      this._dirty = false
      this.removeCache()
    },
    toggleEditOrAdd (component, showAdd, addPosition = ADD_COMPONENT_OVERLAY_POSITION.UNKNOWN) {
      const { showAddComponentOverlay, addComponentOverlayPosition } = this
      const id = this.getUUIDFromValue(component)
      if (
        this.isSelected(component) &&
        showAddComponentOverlay === showAdd &&
        addPosition === addComponentOverlayPosition
      ) {
        return
      }
      this.selectedUUID = id
      this.showAddComponentOverlay = showAdd
      this.addComponentOverlayPosition = addPosition
      this.adjustHeight()
    },
    selectByIndex (index, value) {
      value = value || this.value
      infex = isUndefined(index) ? this.defaultSelectedIndex : index
      const safeIndex = getSafeSelectedValueIndex(index, value)
      this.safeValue = value[safeIndex]
      this.selectedUUID = this.getUUIDFromValue(safeValue)
      this.showAddComponentOverlay = false
    },
    isSelected () {
      const { selectedUUID } = this
    return this.getUUIDFromValue(value) === selectedUUID
    },
    hasSelected() {
      const { selectedUUID } = this
      return !!selectedUUID
    },
    getUUIDFromValue () {
      return value && value[UUID_KEY]
    },
    setUUIDForValue (value, id) {
      if (value) {
        value[UUID_KEY] = id;
      }
      return value
    },
    savePreview (instance) {
      if (instance && instance.getDecoratedComponentInstance) {
        instance = instance.getDecoratedComponentInstance()
      }
      this.preview = instance
    },
     // 滚动到第一个有错误的组件
     scrollToPreviewItem (id) {
       if (this.preview) {
        const { scrollTopOffset, scrollLeftOffset } = this
        this.preview.scrollToItem &&
        this.preview.scrollToItem(id, {
          top: scrollTopOffset,
          left: scrollLeftOffset,
        })
       }
     },
    // 调整 Design 的高度，因为 editor 是 position: absolute 的，所以需要动态的更新
    // 实际并未改变高度，而是设置了margin/padding
    adjustHeight(id) {
      // 不要重复执行
      if (this.adjustHeightTimer) {
        clearTimeout(this.adjustHeightTimer)
        this.adjustHeightTimer = undefined
      }
      if (!previewBB) {
        this.adjustHeightTimer = setTimeout(() => {
          id = id || this.selectedUUID
          if (this.preview && this.preview.getEditorBoundingBox) {
            const editorBB = this.preview.getEditorBoundingBox(id);
            if (!editorBB) {
              return this.bottomGap = 0
            }
            const previewNode = findDOMNode(this.preview)
            const previewBB = previewNode && previewNode.getBoundingClientRect()
            if (!previewBB) {
              return
            }
            const gap = Math.max(0, editorBB.bottom - previewBB.bottom)
            this.bottomGap = gap
          }
        }, 0)
      }
    },
    // 调用 onChange 的统一入口，用于处理一些需要知道有没有修改过值的情况
    trackValueChange(newValue, writeCache = true) {
      const { onChange } = this
      onChange(newValue)
      if (!this._dirty) {
        this._dirty = true;
      }
      if (writeCache) {
        this.writeCache(newValue)
      }
      this.adjustHeight()
    },
    setupBeforeUnloadHook() {
      const {confirmUnsavedLeave} = this
      if (this._hasBeforeUnloadHook || !confirmUnsavedLeave) {
        return
      }
      window.addEventListener('beforeunload', this.onBeforeWindowUnload)
      this._hasBeforeUnloadHook = true
    },
    uninstallBeforeUnloadHook () {
      window.removeEventListener('beforeunload', this.onBeforeWindowUnload)
      this._hasBeforeUnloadHook = false
    },
    onBeforeWindowUnload (evt) {
      if (!this._dirty) {
        return
      }
      // 这个字符串其实不会展示给用户
      const confirmLeaveMessage = '页面上有未保存的数据，确定要离开吗？'
      evt.returnValue = confirmLeaveMessage
      return confirmLeaveMessage
    },
    // 缓存相关的函数
    validateCacheProps(props) {
      props = props || this.$props
      const { cache, cacheId } = props
      if (cache && !cacheId) {
        throw new Error('Design: cacheId is required when cache is on')
      }
    },
    checkCache () {
      const { cache } = this
      if (cache) {
        const cachedValue = this.readCache()
        if (cachedValue !== storage.NOT_FOUND) {
          this.showRestoreFromCache = true
        }
      }
    },
    readCache () {
      const { cache } = this
      if (!cache) {
        return storage.NOT_FOUND
      }
      const { cacheId } = this
      return storage.read(CACHE_KEY, cacheId)
    },
    writeCache (value) {
      const { cache } = this
      if (!cache) {
        return false
      }
      const { cacheId } = this
      return storage.write(CACHE_KEY, cacheId, value)
    },
    removeCache () {
      // 这个函数不需要检查有没有开启缓存，强制清除
      const { cacheId } = this
      return storage.write(CACHE_KEY, cacheId, undefined)
    },
    // 关闭提示，但是不清楚缓存
    onRestoreCacheAlertClose () {
      this.showRestoreFromCache = false
    },
    // 恢复缓存的数据并删除缓存
    restoreCache (evt) {
      evt.preventDefault()

      const cachedValue = this.readCache();
      if (cachedValue !== storage.NOT_FOUND) {
        this.trackValueChange(cachedValue, false)
        this.showRestoreFromCache = false
        this.removeCache()
      }
    },
    getDecoratedComponentInstance () {
      return this
    }
  }
};
</script>

