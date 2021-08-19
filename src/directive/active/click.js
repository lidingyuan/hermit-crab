export default {
  inserted (el, binding) {
    const className = binding.arg || 'active'
    addEventListener(el, className)
  }
}

function addEventListener (el, className) {
  el.addEventListener('mouseleave', () => {
    removeClass(el, className)
  })
  el.addEventListener('mousedown', () => {
    addClass(el, className)
  })
  el.addEventListener('mouseup', () => {
    removeClass(el, className)
  })
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
