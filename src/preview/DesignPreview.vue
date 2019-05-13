<script>
import { find, some, defaultTo, isFunction, get } from 'lodash';

import DesignPreviewItem from './DesignPreviewItem';
import DesignPreviewController from './DesignPreviewController';
import DesignEditorItem from '../editor/DesignEditorItem';
import DesignEditorAddComponent from '../editor/DesignEditorAddComponent';
import { isExpectedDesignType } from '../utils/design-type';
import { DND_PREVIEW_CONTROLLER, DEFAULT_BACKGROUND } from './constants';
import { ADD_COMPONENT_OVERLAY_POSITION } from '../constants';

/**
 * DesignPreview 和 config 组件是相互关联的
 *
 * 这个组件里的一些 props 是需要 config 组件提供的
 */
export default {
    name: 'DesignPreview',
    props: {
        className: {
            type: String
        }
    }
}
</script>
