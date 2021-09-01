import Vue from 'vue'
import ZlInput from './ZlInput'
import ZlCheckBox from './ZlCheckBox'
import ZlRadio from './ZlRadio'
import ZlCheckIcon from './ZlCheckIcon'
import ZlQueryParam from './ZlQueryParam'
const components = {
  ZlInput,
  ZlCheckBox,
  ZlRadio,
  ZlCheckIcon,
  ZlQueryParam
}
Object.keys(components).forEach(key => Vue.component(key, components[key]))
