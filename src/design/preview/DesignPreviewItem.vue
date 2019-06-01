<template>
  <div :class="[`${prefix}-design-preview-item`]" ref="previewItem">
      <slot></slot>
  </div>
</template>
<script>
import { isFunction } from "lodash";
import scroll from "../utils/scroll";

function scrollNodeToTop(offsets) {
  const pos = offset(node);
  const top = isFunction(offsets.top)
    ? offsets.top(pos.top)
    : pos.top + offsets.top;
  const left = isFunction(offsets.left)
    ? offsets.left(pos.left)
    : pos.left + offsets.left;
  scroll(document.body, left, top);
}
export default {
  props: {
    prefix: {
        type: String,
        default: 'segi'
    }
  },
  methods: {
      scrollTop(offsets) {
          const node = this.$refs.previewItem
          scrollNodeToTop(node, offsets)
      }
  }
};
</script>
