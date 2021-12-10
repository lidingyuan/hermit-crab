
const outEl = document.createElement('div')
const inEl = document.createElement('div')
outEl.style = 'position: fixed;top: -99999px;left: -99999px;width: 100px;height: 100px;'
inEl.style = 'width: 100%;height: 100%;overflow: scroll;'
outEl.appendChild(inEl)
function setBarWidth () {
  document.body.appendChild(outEl)
  const barXWidth = outEl.clientHeight - inEl.clientHeight
  const barYWidth = outEl.clientWidth - inEl.clientWidth
  document.body.removeChild(outEl)
  return { barXWidth, barYWidth }
}

const funList = []
window.addEventListener('resize', resize)
function resize () {
  funList.forEach(fun => {
    fun(setBarWidth())
  })
}

export function addBarWidthListener (fun) {
  fun(setBarWidth())
  funList.push(fun)
}

export function removeBarWidthListener (fun) {
  funList.splice(funList.findIndex(fun), 1)
}
