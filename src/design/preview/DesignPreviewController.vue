<template>
  <Draggable v-if="dragable">
    <div :class="getClassName(allowHoverEffects && highlightWhenSelect)" @click="onSelect">
      <div :class="`${prefix}-design-preview-controller__drag-handle`">
        <slot :slot-scope="{...previewProps,value, design, globalConfig, settings}"></slot>
      </div>
      {{provided.placeholder}}
      <div v-if="configurable && canDelete">
        删除组件
        <button>删除</button>
      </div>
      <div v-if="showButtons && canInsert">
        插入一个组件之前
        <button @click="onPrepend">添加</button>
      </div>
      <div v-if="showButtons && canInsert ">
        插入一个组件在之后
        <button @click="onAppend">添加</button>
      </div>
    </div>
  </Draggable>
  <div v-else @click="onSelect" :class="getClassName(highlightWhenSelect)">
    <div
      :class="[`${prefix}-design-preview-controller__drag-handle`, `${prefix}-design-preview-controller__drag-handle--inactive`]"
    >
      <slot :slot-scope="{...previewProps,value, design, globalConfig, settings}"></slot>
    </div>
    <div v-if="configurable && canDelete">
      删除组件
      <button>删除</button>
    </div>
    <div v-if="showButtons && canInsert">
      插入一个组件之前
      <button @click="onPrepend">添加</button>
    </div>
    <div v-if="showButtons && canInsert ">
      插入一个组件在之后
      <button @click="onAppend">添加</button>
    </div>
  </div>
</template>
<script>
import { Container, Draggable } from "vue-smooth-dnd";
import { pick, get } from "lodash";
import { DND_PREVIEW_CONTROLLER, DEFAULT_BACKGROUND } from "./constants";
import { ADD_COMPONENT_OVERLAY_POSITION } from "../constants";

export default {
  components: { Draggable },
  props: {
    // 这个组件的唯一标示，不随位置变化而变化
    id: String,
    // 组件的下标，-1 如果不可拖拽
    index: Number,
    // 是否允许 hover 效果，不允许的话不会显示各种按钮
    // 拖拽的时候用
    allowHoverEffects: Boolean,
    // 是否可以编辑，UMP里面有些地方config是不能编辑的
    editable: Boolean,
    // 组件是否可以拖拽
    dragable: Boolean,
    // 是否显示右下角的编辑区域
    configurable: Boolean,
    // 时候现实删除按钮
    canDelete: Boolean,
    // 是否吸纳事添加组件按钮
    canInsert: Boolean,
    // 选中时是否高亮
    highlightWhenSelect: Boolean,
    // 当前是否选中
    isSelected: Boolean,
    // 这个组件对应的值
    value: Object,
    // Design 组件的全局配置
    settings: Object,
    // 选中的回调函数
    // onSelect: Function,
    // 编辑的回调函数
    onEdit: Function,
    // 添加新组件的回调函数
    onAdd: Function,
    // 删除组件的回调函数
    // onDelete: Function,
    // 拖拽时移动组件的回调函数
    onMove: Function,
    // design 组件暴露的方法
    design: Object,
    // 用来渲染预览的组件
    component: Function,
    // 自定义配置
    globalConfig: Object,
    // preview 额外的 props
    previewProps: Object,
    prefix: {
      type: String,
      default: "segi"
    }
  },
  data() {
    return {
      provided: {},
      snapshot: {},
      DEFAULT_BACKGROUND
    };
  },
  computed: {
    showButtons() {
      return (
        this.configurable && this.allowHoverEffects && !this.snapshot.isDragging
      );
    }
  },
  methods: {
    getClassName(highlight) {
      return {
        [`${this.prefix}-design-preview-controller`]: true,
        [`${this.prefix}-design-preview-controller--editable`]: this.editable,
        [`${this.prefix}-design-preview-controller--selected`]: this.isSelected,
        [`${this.prefix}-design-preview-controller--highlight`]: highlight,
        [`${this.prefix}-design-preview-controller--dragable`]: this.dragable
      };
    },
    onSelect(evt) {
    const { editable } = this;
    if (!editable) return;
    this.$emit("onSelect", evt, false);
  },
  onPrepend() {
    this.invokeCallback("onAdd", evt, true, ADD_COMPONENT_OVERLAY_POSITION.TOP);
  },
  onAppend() {
    this.invokeCallback(
      "onAdd",
      evt,
      true,
      ADD_COMPONENT_OVERLAY_POSITION.BOTTOM
    );
  },
  onDelete() {
    this.invokeCallback("onDelete", null, true);
  },
  invokeCallback(action, evt, stopPropagation, ...args) {
    if (stopPropagation && avt) {
      evt.stopPropagation();
    }
    const { value } = this.props;
    const cb = this.props[action];
    cb && cb(value, ...args);
  },
  get
  },
  
};
</script>

