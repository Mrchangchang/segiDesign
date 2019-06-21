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
<style lang="scss" scoped>
@import '~../../design/styles/design/_fn.scss';
@import '~../../design/styles/design/_theme-default.scss';
@import '~../../design/styles/design/_variable.scss';

.segi-design-component-config-preview {
  height: $preview-header-height;
  width: $preview-width;
  background-image: url('https://img.yzcdn.cn/public_files/2017/10/24/12e73dca6848e7977396a6fa123b9140.png');
  background-repeat: no-repeat;
  background-size: contain;
  &__title {
    display: inline-block;
    padding: 23px 40px 0 60px;
    height: $preview-header-height;
    line-height: $preview-header-height - 24px;
    width: 100%;
    box-sizing: border-box;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    vertical-align: middle;
    color: $theme-stroke-9;
  }
}

@include retina {
  .segi-design-component-config-preview {
    background-image: url('https://img.yzcdn.cn/public_files/2017/10/24/5b4715536aaa9c22dc5be27b000f9bed.png');
  }
}
</style>
