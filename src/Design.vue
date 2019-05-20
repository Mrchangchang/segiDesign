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
    <div :class="[`${prefix}-design`, className]"></div>
</template>
<script>
import {
  assign,
  find,
  findIndex,
  isEmpty,
  isUndefined,
  defaultTo,
  isFunction,
} from 'lodash';
import * as storage from 'zent/es/utils/storage'
import uuid from './utils/uuid';

export default {
    props: {
        components: Array
    },
    data () {
        return {}
    }
}
</script>

