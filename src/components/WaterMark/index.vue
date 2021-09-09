<template>
  <div
    class="water-mark"
    :style="style"
  />
</template>

<script>
export default {
  name: 'WaterMark',
  props: {
    text: {
      type: String,
      default: '州力'
    },
    fontSize: {
      type: Number,
      default: 32
    },
    color: {
      type: [String, Array],
      default: '#cec'
    },
    deg: {
      type: Number,
      default: -45
    },
    // 密度
    minLength: {
      type: Number,
      default: 1
    },
    opacity: {
      type: Number,
      default: 0.15
    }
  },
  data () {
    return { observer: null }
  },
  computed: {
    style () {
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(this.text.length, this.minLength) * this.fontSize + this.fontSize
      canvas.height = Math.max(this.text.length, this.minLength) * this.fontSize * Math.abs(Math.sin(this.deg * Math.PI / 180)) + this.fontSize
      const ctx = canvas.getContext('2d')
      const sin = Math.sin(this.deg * Math.PI / 180)
      const cos = Math.cos(this.deg * Math.PI / 180)
      ctx.translate(cos < 0 ? canvas.width - (this.fontSize / 4) : this.fontSize / 2, sin < 0 ? canvas.height - (this.fontSize / 4) : this.fontSize / 2)
      ctx.rotate(this.deg * Math.PI / 180)
      if (Object.prototype.toString.call(this.color) === '[object Array]') {
        const gr = ctx.createLinearGradient(0, 0, canvas.width, 0)
        this.color.forEach((color, index) => {
          gr.addColorStop(index / this.color.length, color)
        })
        ctx.fillStyle = gr
      } else {
        ctx.fillStyle = this.color
      }
      const fontargs = ctx.font.split(' ')
      ctx.font = this.fontSize + 'px ' + fontargs[fontargs.length - 1]
      ctx.fillText(this.text, 0, 0)
      const url = canvas.toDataURL()
      return {
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        position: 'absolute',
        'pointer-events': 'none',
        opacity: this.opacity,
        'z-index': 99999,
        background: `url(${url})`,
        'background-attachment': 'scroll'
      }
    }
  },
  mounted () {
    this.observer = new MutationObserver(() => {
      const markList = [...document.body.getElementsByClassName('water-mark')]
      const mark = markList.find(mark => {
        return mark === this.$el
      })
      if (!mark) {
        const emptymark = document.createElement('div')
        emptymark.innerHTML = '文档结构被破坏，重新加载'
        emptymark.style = 'position:fixed;top:0;bottom:0;left:0;right:0;z-index:999999;background:#fff;'
        document.body.appendChild(emptymark)
        location.reload()
      }
    })
    const config = {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true
    }
    this.observer.observe(this.$parent.$el, config)
  },
  beforeDestroy () {
    this.observer.disconnect()
  }
}
</script>
