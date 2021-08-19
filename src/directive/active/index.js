import click from './click'
const argMap = {
  click
}

export default function active (Vue) {
  Vue.directive('active', {
    inserted: function (el, binding) {
      const keyList = Object.keys(binding.modifiers)
      if (!keyList.length) {
        click.inserted(el, binding)
      }
      keyList.forEach(key => {
        const argType = argMap[key] || click
        argType.inserted(el, binding)
      })
    }
  })
}
