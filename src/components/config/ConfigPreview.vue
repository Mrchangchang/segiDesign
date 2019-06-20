<template>
  <div :class="`${prefix}-design-component-config-preview`">
    <div :class="`${prefix}-design-component-config-preview__title`">{{value.title}}</div>
  </div>
</template>
<script>
export default {
  name: 'ConfigPreview',
  props: {
    value: {
      type: Object,
      default: () => {}
    },
    prefix: {
      type: String,
      default: "segi"
    },
    design: {
      type: Object,
      default: () =>{}
    }
  },
  data() {
    return {};
  }
};
</script>
