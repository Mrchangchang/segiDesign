<template>
  <Container @drop="dispatchDragEnd">
    <div
      :class="[`${prefix}-design-preview`, className]"
      :style="{background: get(
              settings,
              'previewBackground',
              '#f9f9f9'
            )}"
    >
      <div :class="`${prefix}-design__disabled-mask`" v-if="disabled"></div>
      <div :class="`${prefix}-design-preview-list`">
        <div :class="[`${prefix}-design__item-list`, !hasAppendableComponent ?`${prefix}-design__item-list--full-height`:'']">
          <DesignPreviewItem v-for="v in value" :key="getUUIDFromValue(v)" :id="getUUIDFromValue(v)" 
          :ref="savePreviewItem(getUUIDFromValue(v))">
            <DesignPreviewController :value="v" :globalConfig="globalConfig" :settings="settings" 
            :design="design" :id="getUUIDFromValue(v)" :index="getIndex(defaultTo(findCom(v).dragable, true))"
            :allowHoverEffects="true" :dragable="defaultTo(findCom(v).dragable, true)" 
            :editable="defaultTo(findCom(v).editable, true)" 
            :configurable="defaultTo(findCom(v).configurable, true)"
            :canDelete="defaultTo(findCom(v).canDelete, true)"
            :canInsert="defaultTo(findCom(v).canInsert, true)"
            :highlightWhenSelect="defaultTo(findCom(v).highlightWhenSelect, true)"
            :isSelected="getUUIDFromValue(v) === selectedUUID"
            :onSelect="onSelect"
            :onDelete="onDelete"
            :onEdit="onEdit"
            :onAdd="onAdd"
            :onMove="onMove"
            :component="findCom(v).preview"
            :previewProps="getAdditionalProps(findCom(v).previewProps, v)">
            </DesignPreviewController>
            {{findCom(v).editor.name}}
            <DesignEditorItem v-if="getUUIDFromValue(v) === selectedUUID && !showAddComponentOverlay"
            :prefix="prefix" :disabled="disabled" :ref="savePreviewItem(getUUIDFromValue(v))">
            
              <component :is="findCom(v).editor && findCom(v).editor.name" 
              :ref="savePreviewItem(getUUIDFromValue(v))"
              :value="v"
              :onChange="onComponentValueChange(v)"
              :settings="settings"
              :onSettingsChange="onSettingsChange"
              :globalConfig = "globalConfig"
              :design="design"
              :validation="validations[getUUIDFromValue(v)]"
              :showError="showError"
              v-bind="getAdditionalProps(findCom(v).editorProps, v)"/>
            </DesignEditorItem>
            <DesignEditorItem v-if="getUUIDFromValue(v) === selectedUUID && showAddComponentOverlay"
            :ref="savePreviewItem(getUUIDFromValue(v))"
            :prefix="prefix"
            :class="[`${prefix}-design-add-component-overlay`,
             addComponentOverlayPosition === ADD_COMPONENT_OVERLAY_POSITION.TOP? `${prefix}-design-add-component-overlay--top`:''
             ,addComponentOverlayPosition===ADD_COMPONENT_OVERLAY_POSITION.BOTTOM?`${prefix}-design-add-component-overlay--bottom`:''
             ,isComponentsGrouped?`${prefix}-design-add-component-overlay--grouped`:`${prefix}-design-add-component-overlay--mixed`]">
              <DesignEditorAddComponent :prefix="prefix" 
              :fromSelected="fromSelected" :componentInstanceCount="componentInstanceCount"
              :designComponents="designComponents"
              :onAddComponent="onAddComponent"/>
            </DesignEditorItem>
          </DesignPreviewItem>
        </div>
      </div>
    </div>
  </Container>
</template>

<script>
import { Container, Draggable } from "vue-smooth-dnd";
import { find, some, defaultTo, isFunction, get } from "lodash";

import DesignPreviewItem from "./DesignPreviewItem";
import DesignPreviewController from "./DesignPreviewController";
import DesignEditorItem from "../editor/DesignEditorItem";
import DesignEditorAddComponent from "../editor/DesignEditorAddComponent";
import { isExpectedDesignType } from "../utils/design-type";
import { DND_PREVIEW_CONTROLLER, DEFAULT_BACKGROUND } from "./constants";
import { ADD_COMPONENT_OVERLAY_POSITION } from "../constants";

/**
 * DesignPreview 和 config 组件是相互关联的
 *
 * 这个组件里的一些 props 是需要 config 组件提供的
 */
function saveRef(map, id, instance) {
  if (!instance) {
    delete map[id];
  } else {
    map[id] = instance;
  }
}

function getAdditionalProps(propsOrFn, value) {
  const props = isFunction(propsOrFn) ? propsOrFn(value) : propsOrFn;

  return props || {};
}

export default {
  name: "DesignPreview",
  components: { Container, Draggable, DesignPreviewItem, DesignPreviewController, DesignEditorItem, DesignEditorAddComponent },
  props: {
    className: String,
    prefix: {
      type: String,
      default: "segi"
    },
    design: Object,
    value: Array,
    settings: Object,
    onSettingsChange: Function,
    footer: Object,
    appendableComponents: {
      type: Array,
      default: []
    },
    showAddComponentOverlay: Boolean,
    addComponentOverlayPosition: Number,
    selectedUUID: String,
    getUUIDFromValue: Function,
    onSelect: Function,
    onAdd: Function, // 处理添加按钮的回调函数
    onAddComponent: Function, // 添加新组件
    onDelete: Function,
    onEdit: Function,
    onMove: Function,
    disabled: {
      type: Boolean,
      default: false
    },
    componentInstanceCount: Object, // 每个组件的示例数量
    background: {
      type: String,
      default: "#f9f9f9"
    },
    globalConfig: {
      type: Object,
      default: []
    },
    designComponents: {
      type: Array,
      default: []
    },
    onComponentValueChange: Function,
    validations: Object,
    showError: Boolean
  },
  data() {
    return {
      previewItems: {},
      editorItems: {},
      editors: {},
      DND_PREVIEW_CONTROLLER
    };
  },
  computed: {
    hasAppendableComponent() {
      return this.appendableComponents.length > 0
    }
  },
  methods: {
    get,
    dispatchDragEnd() {

    },
    defaultTo,
    findCom(v) {
      let valueType = v.type
      if(this.designComponents.length) {
        return find(this.designComponents, c => {
          return isExpectedDesignType(c, valueType)
        }) || {name:''}
      }
      return {name:''}
    },
    savePreviewItem() {
      return (instance) => {
        saveRef(this.editorItems, id, instance)
      }
    },
    getIndex (draggable) {
      if (!this.index) this.index = 0
      if (draggable) {
        this.index ++
        return this.index
      } else {
        return -1
      }
    },
    getAdditionalProps
  }
};
</script>
