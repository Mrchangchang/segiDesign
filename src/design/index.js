import 'ant-design-vue/dist/antd.css'
import './styles/index.scss'
import Design from './Design.vue'
import stripUUID from './stripUUID.js'
import { createGroup } from './utils/component-group'

Design.stripUUID = stripUUID;
Design.group = createGroup
export  default Design