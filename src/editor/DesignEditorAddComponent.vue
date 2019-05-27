<template>
  <div>
    <div v-if="!components || !components.length"></div>
    <div v-else-if="isGrouped(components)"></div>
    <div v-else :class="`${prefix}-design-editor-add-component ${prefix}-design-editor-add-component--mixed`">
      <div :class="`${prefix}-design-editor-add-component__mixed-title`">添加内容</div>
      <div :class="`${prefix}-design-editor-add-component__mixed-list`"></div>
    </div>
  </div>
</template>

<script>
import { isFunction, isNumber, noop } from "lodash";
import LazyMap from "../utils/LazyMap";
import { serializeDesignType } from "../utils/design-type";
import { splitGroup, isGrouped } from "../utils/component-group";

export default {
  name: "DesignEditorAddComponent",
  props: {
    components: Array,
    componentInstanceCount: Object,
    onAddComponent: Function,
    fromSelected: {
      type: Boolean,
      default: false
    },
    prefix: {
      type: String,
      default: "segi"
    }
  },
  data() {
    return {
      popVisibleMap: new LazyMap(false)
    };
  },
  methods: {
    onPopVisibleChange(key) {
      return visible => {
        this.popVisibleMap = this.popVisibleMap.clone().set(key, visible);
      };
    },
    onAdd(component) {
      const { componentInstanceCount } = this;
      if (canAddMoreInstance(component, componentInstanceCount)) {
        const { shouldCreate } = component;
        shouldAddComponentPromise(component, shouldCreate).then(() => {
          const { fromSelected, onAddComponent } = this;
          onAddComponent(component, fromSelected);
        }, noop);
      }
    },
    isGrouped
  }
};
</script>

