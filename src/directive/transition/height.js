export default {
  inserted (el, binding) {
    addEventListener(el)
    el.style.transition = 'height 0.5s'
    el.style.overflow = 'hidden'
    if (binding.value) {
      el.style.height = ''
      el.style.display = ''
    } else {
      el.style.height = '0'
      el.style.display = 'none'
    }
  },
  update (el, binding) {
    if (binding.oldValue === binding.value) {
      return
    }
    if (binding.value) {
      el.style.display = ''
      setTimeout(() => {
        el.style.height = getchildHeight(el) + 'px'
      }, 0)
    } else {
      el.style.height = getchildHeight(el) + 'px'
      setTimeout(() => {
        el.style.height = '0'
      }, 0)
    }
  }
}

function getchildHeight (el) {
  let height = 0
  el.childNodes.forEach(child => {
    height += child.offsetHeight
  })
  return height
}
function addEventListener (el) {
  function transitionend (e) {
    if (e.propertyName !== 'height') {
      return
    }
    e.stopPropagation()
    if (el.offsetHeight) {
      el.style.height = ''
    } else {
      el.style.display = 'none'
    }
  }
  el.addEventListener('transitionend', transitionend, false)
}
