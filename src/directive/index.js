import active from './active'
import transition from './transition'

export default function directive (Vue) {
  active(Vue)
  transition(Vue)
}
