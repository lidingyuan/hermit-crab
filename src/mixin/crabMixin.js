import Vue from 'vue'
import { throttle, debounce } from '@/utils/functionUtil'

Vue.mixin({
  created () {
    const throttles = this.$options.throttles
    if (throttles) {
      Object.keys(throttles).forEach(key => {
        if (this[key] !== undefined) {
          // console.error(`throttles绑定错误：组件${this.$options.name}已有${key}`)
          return
        }
        const obj = {
          name: this,
          fun: throttles[key]
        }
        this[key] = (...args) => {
          throttle.call(this, obj, args)
        }
      })
    }
    const debounces = this.$options.debounces
    if (debounces) {
      Object.keys(debounces).forEach(key => {
        if (this[key] !== undefined) {
          // console.error(`debounces绑定错误：组件${this.$options.name}已有${key}`)
          return
        }
        const obj = {
          name: this,
          fun: debounces[key]
        }
        this[key] = (...args) => {
          debounce.call(this, obj, args)
        }
      })
    }
  }
})
