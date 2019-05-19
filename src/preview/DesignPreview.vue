<template>
  <Container @drop="dispatchDragEnd">
    <div
      :class="[`${prefix}-design-preview`, className]"
      :style="get(
              settings,
              'previewBackground',
              DEFAULT_BACKGROUND
            )"
    >
      <div :class="`${prefix}-design__disabled-mask`" v-if="disabled">
      </div>
      <!-- <Droppable :group-name="DND_PREVIEW_CONTROLLER" v-for="(item, index) in value" :key="index">

      </Droppable> -->
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
  components: { Container, Draggable },
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
    get
  }
};
</script>
