<template>
  <div>
    <div v-if="!components || !components.length"></div>
    <div v-else-if="isGrouped(components)"></div>
    <div v-else :class="`${prefix}-design-editor-add-component ${prefix}-design-editor-add-component--mixed`">
      <div :class="`${prefix}-design-editor-add-component__mixed-title`">添加内容</div>
      <div :class="`${prefix}-design-editor-add-component__mixed-list`">
        <Popconfirm placement="rightTop" :trigger="disabled && message ? 'hover' : 'none'" :visible="visible">
          <div slot="content">
            {{message}}
          </div>
          <a href="javascript:;" @click="onAdd(component)" 
          :class="[`${prefix}-design-editor-add-component__${type}-btn`,disabled?`${prefix}-design-editor-add-component__${type}-btn--disabled`:``]"
          :disabled="disabled">
          {{component.editor.designDescription}}
          </a>
        </Popconfirm>
      </div>
    </div>
  </div>
</template>

<script>
import { isFunction, isNumber, noop } from "lodash";
import LazyMap from "../utils/LazyMap";
import { serializeDesignType } from "../utils/design-type";
import { splitGroup, isGrouped } from "../utils/component-group";
import {Popconfirm} from 'ant-design-vue'

function canAddMoreInstance (component, componentInstanceCount) {
  const { type, limit } = component
  const key = serializeDesignType(type)
  const count = componentInstanceCount.get(key)
  if (isFunction(limit)) {
    return limit(count)
  }
  return limit ? count < limit : true
}

function getLimitMessage (component, componentInstanceCount) {
  const { type, limitMessage, limit } = component
  const key = serializeDesignType(type)
  const count = componentInstanceCount.get(key)

  if (isFunction(limitMessage)) {
    return limitMessage(count)
  }

  let defaultMessage = ''

  if (isNumber(limit)) {
    // limit === 0 表示不限制
    if (limit > 0) {
      defaultMessage = `该组件最多可以添加 ${limit} 个`
    } else if (limit < 0) {
      defaultMessage = '该组件暂不可用'
    }
  }

  return limitMessage || defaultMessage
}

// Normalize to Promise
function shouldAddComponentPromise (component, fn) {
  if (isFunction(fn)) {
    return fn(component)
  }
  return Promise.resolve()
}

export default {
  name: "DesignEditorAddComponent",
  components: {
    Popconfirm
  },
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
  computed: {
    disabled () {
      return !canAddMoreInstance(this.component, this.componentInstanceCount)
    },
    key () {
      return serializeDesignType(this.component.type)
    },
    visible () {
      return this.popVisibleMap.get(this.key)
    },
    message() {
      return getLimitMessage(this.component, this.componentInstanceCount)
    }
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

