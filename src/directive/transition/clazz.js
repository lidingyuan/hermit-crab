export default {
  inserted (el, binding) {
    if (!el.style.transition) {
      el.style.transition = 'all 0.5s'
    }
    const className = binding.arg
    if (binding.modifiers.show) {
      transitionend(el, className)
      addEventListener(el, className)
    }
    if (binding.value) {
      if (binding.modifiers.show) {
        el.style.display = ''
      }
      addClass(el, className)
    } else {
      if (binding.modifiers.show) {
        el.style.display = 'none'
      }
      removeClass(el, className)
    }
  },
  update (el, binding) {
    if (binding.value) {
      el.style.display = ''
      setTimeout(() => {
        addClass(el, binding.arg)
      }, 0)
    } else {
      removeClass(el, binding.arg)
    }
  }
}

function addEventListener (el, className) {
  el.addEventListener('transitionend', () => {
    transitionend(el, className)
  })
}
function transitionend (el, className) {
  if (!haveClass(el, className)) {
    el.style.display = 'none'
  }
}

/**
 * @description: 移除class
 * @param {HTMLElement} node
 * @param {String} className
 */
function removeClass (node, className) {
  const classList = node.className.split(' ').filter(name => !!name)
  const index = classList.findIndex(clazz => clazz === className)
  index > -1 && classList.splice(index, 1)
  node.className = classList.reduce((accumulator, currentValue) => {
    return accumulator + ' ' + currentValue
  }, '')
}

/**
 * @description: 添加class自动去重
 * @param {HTMLElement} node
 * @param {String} className
 */
function addClass (node, className) {
  const classList = node.className.split(' ').filter(name => !!name)
  classList.push(className)
  node.className = Array.from(new Set(classList)).reduce((accumulator, currentValue) => {
    return accumulator + ' ' + currentValue
  }, '')
}
/**
 * @description: 添加class自动去重
 * @param {HTMLElement} node
 * @param {String} className
 */
function haveClass (node, className) {
  return node.className.includes(className)
}
