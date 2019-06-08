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
          <component :is="findCom(v).preview.name" v-for="v in value" :key="getUUIDFromValue(v)" :id="getUUIDFromValue(v)" :ref="savePreviewItem(getUUIDFromValue(v))">
            <DesignPreviewController :value="v" :globalConfig="globalConfig" :settings="settings" 
            :design="design" :id="getUUIDFromValue(v)" :index="draggable ? draggableIndex++ : -1"
            :allowHoverEffects="!isDraggingOver" :dragable="dragable">

            </DesignPreviewController>
          </component>
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
export default {
  name: "DesignPreview",
  components: { Container, Draggable, DesignPreviewItem, DesignPreviewController },
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
      default: () => []
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
    }
  },
  data() {
    return {
      previewItems: {},
      editorItems: {},
      editors: {},
      DND_PREVIEW_CONTROLLER
    };
  },
  methods: {
    get,
    dispatchDragEnd() {

    },
    defaultTo,
    findCom(v) {
      let valueType = v.type
      if(this.components.length) {
        find(this.commponents, c => {
          return isExpectedDesignType(c, valueType)
        })
      }
    }
  }
};
</script>
