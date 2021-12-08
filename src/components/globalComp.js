import Vue from 'vue'
import ZlInput from './ZlInput'
import ZlCheckBox from './ZlCheckBox'
import ZlRadio from './ZlRadio'
import ZlCheckIcon from './ZlCheckIcon'
import ZlTree from './ZlTree'
import ZlQueryParam from './ZlQueryParam'
import ZlTable from './ZlTable'
import ZlExcel from './ZlExcel'
const components = {
  ZlInput,
  ZlCheckBox,
  ZlRadio,
  ZlCheckIcon,
  ZlTree,
  ZlQueryParam,
  ZlTable,
  ZlExcel
}
Object.keys(components).forEach(key => Vue.component(key, components[key]))
