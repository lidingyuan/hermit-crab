const functionMap = new WeakMap()

/**
 * 防抖
 * @param {Object} {fun:执行的函数,name:名称}
 */
export function debounce (obj, args) {
  functionMap.get(obj) && clearTimeout(functionMap.get(obj).index)
  function finish (timeout) {
    return new Promise(resolve => {
      functionMap.set(obj, {
        index: setTimeout(() => {
          functionMap.delete(obj)
          resolve()
        }, timeout),
        timeout: timeout,
        resolve: resolve
      })
    })
  }
  if (functionMap.get(obj) === undefined) {
    // 初始化一个假值，设置1天时长，阻碍finish未执行时的后续触发
    functionMap.set(obj, {
      index: -1,
      timeout: 1000 * 60 * 60 * 24,
      resolve: () => {}
    })
    obj.fun.call(this, finish, ...args)
  } else {
    // 多次触发时更新finish传入的延时
    functionMap.set(obj, {
      index: setTimeout(() => {
        const resolve = functionMap.get(obj).resolve
        functionMap.delete(obj)
        resolve()
      }, functionMap.get(obj).timeout),
      timeout: functionMap.get(obj).timeout,
      resolve: functionMap.get(obj).resolve
    })
  }
}

/**
 * 节流
 * @param {Function} fun 执行的函数
 */
export function throttle (obj, args) {
  function finish (timeout) {
    return new Promise(resolve => {
      functionMap.set(obj, {
        index: setTimeout(() => {
          clearTimeout(functionMap.get(obj).index)
          functionMap.delete(obj)
          resolve()
        }, timeout)
      })
    })
  }
  if (functionMap.get(obj) === undefined) {
    // 初始化一个假值，阻碍finish未执行时的后续触发
    functionMap.set(obj, {
      index: -1
    })
    obj.fun.call(this, finish, ...args)
  }
}
