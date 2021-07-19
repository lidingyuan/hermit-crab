import height from './height'
import clazz from './clazz'
const argMap = {
  height
}

export default function transition (Vue) {
  Vue.directive('transition', {
    inserted: function (el, binding) {
      const argType = argMap[binding.arg] || clazz
      argType.inserted(el, binding)
    },
    update: function (el, binding) {
      const argType = argMap[binding.arg] || clazz
      argType.update(el, binding)
    }
  })
}
