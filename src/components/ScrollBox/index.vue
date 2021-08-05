<template>
  <div
    class="scroll-box"
    ref="scroll-box"
    :style="boxStyle"
  >
    <div @mouseover="hover(true)" @mouseleave="hover(false)" class="scroll-view" ref="scroll-view" @scroll="scroll" :style="{height:`calc(100% + ${hideYWidth}px)`,width:`calc(100% + ${hideXWidth}px)`}">
      <slot></slot>
      <div
        @mousedown="beginScroll($event,'Y')"
        class="bar-y"
        :style="{height:coefficientY * 100 + '%',backgroundColor: showBar.Y ? backgroundColor : '',transform: 'translate3d(0, '+barYTop+', 0)'}"
      >
      </div>
      <div
        @mousedown="beginScroll($event,'X')"
        class="bar-x"
        :style="{width:coefficientX * 100 + '%',backgroundColor: showBar.X ? backgroundColor : '',transform: 'translate3d('+barXLeft+', 0, 0)'}"
      >
      </div>
    </div>
  </div>
</template>

<script>
const scrollNameMap = {
  Y: 'scrollTop',
  X: 'scrollLeft'
}

export default {
  name: 'ScrollBox',
  props: {
    // 滚动条颜色
    backgroundColor: {
      type: String,
      default: 'rgba(0,0,0,0.3)'
    },
    scrollTop: Number,
    scrollLeft: Number,
    type: String
  },
  data () {
    return {
      //
      showBar: {
        Y: false,
        X: false
      },
      // 滚动视窗宽高/实际宽高
      coefficientX: 0,
      coefficientY: 0,
      barYTop: 0,
      barXLeft: 0,
      // 隐藏的宽高 用于隐藏默认滚动条
      hideYWidth: 0,
      hideXWidth: 0,
      overflow: 'scroll',
      listener: null,
      clickBegin: {
        X: 0,
        Y: 0
      },
      clientBegin: {
        X: 0,
        Y: 0
      },
      clickBarName: ''
    }
  },
  computed: {
    boxStyle () {
      const boxStyle = { overflow: this.overflow }
      if (this.type === 'flex') {
        boxStyle.margin = `0 0 -${this.hideYWidth}px 0`
      }
      return boxStyle
    }
  },
  watch: {
    scrollTop (val) {
      this.$refs['scroll-view'].scrollTop = val
    },
    scrollLeft (val) {
      this.$refs['scroll-view'].scrollLeft = val
    }
  },
  mounted () {
    const that = this
    this.listener = () => {
      that.computeBarWidth()
    }
    window.addEventListener('resize', this.listener)
    this.computeBarWidth()
  },
  methods: {
    //
    hover (b) {
      this.showBar.Y = false
      this.showBar.X = false
      if (this.coefficientY < 1 && this.hideYWidth !== 0) {
        this.showBar.Y = b
      }
      if (this.coefficientX < 1 && this.hideXWidth !== 0) {
        this.showBar.X = b
      }
    },
    scroll () {
      const el = this.$refs['scroll-view']
      if (el) {
        this.barYTop = el.scrollTop / el.clientHeight * 100 + '%'
        this.barXLeft = el.scrollLeft / el.clientWidth * 100 + '%'
      }
      this.$emit('scrollChange', el.scrollTop, el.scrollLeft)
    },
    computeBarWidth () {
      this.overflow = 'scroll'
      this.hideYWidth = 0
      this.hideXWidth = 0
      this.$nextTick(() => {
        this.hideYWidth = parseFloat(window.getComputedStyle(this.$refs['scroll-box']).height) - parseFloat(window.getComputedStyle(this.$refs['scroll-view']).height)
        this.hideXWidth = parseFloat(window.getComputedStyle(this.$refs['scroll-box']).width) - parseFloat(window.getComputedStyle(this.$refs['scroll-view']).width)
        this.overflow = 'hidden'
        this.$nextTick(() => {
          const el = this.$refs['scroll-view']
          this.coefficientY = el.clientHeight / el.scrollHeight
          this.coefficientX = el.clientWidth / el.scrollWidth
        })
      })
    },
    beginScroll (event, d) {
      this.showBar[d] = true
      this.clickBegin[d] = event['client' + d]
      this.clientBegin[d] = this.$refs['scroll-view'][scrollNameMap[d]]
      this.clickBarName = d
      document.addEventListener('mousemove', this.moveScroll)
      document.addEventListener('mouseup', this.endScroll)
    },
    moveScroll (event) {
      const el = this.$refs['scroll-view']
      const barMove = event['client' + this.clickBarName] - this.clickBegin[this.clickBarName]
      el[scrollNameMap[this.clickBarName]] = this.clientBegin[this.clickBarName] + barMove / this['coefficient' + this.clickBarName]
      this.$emit('scrollChange', el.scrollTop, el.scrollLeft)
    },
    endScroll () {
      this.clickBegin[this.clickBarName] = 0
      this.clickBarName = ''
      document.removeEventListener('mousemove', this.moveScroll)
      document.removeEventListener('mouseup', this.endScroll)
    }
  },
  beforeDestroy () {
    document.removeEventListener('mousemove', this.moveScroll)
    document.removeEventListener('mouseup', this.endScroll)
    window.removeEventListener('resize', this.listener)
  }
}
</script>

<style lang='scss' scoped>
.scroll-box{
  position: relative;
  height: 100%;
  width: 100%;
}
.bar-y{
  cursor: pointer;
  position: absolute;
  z-index: 1;
  width: 5px;
  right: 2px;
  top: 0;
  border-radius: 5px;
  transition: background-color 0.5s;
  user-select: none;
}
.bar-x{
  cursor: pointer;
  position: absolute;
  z-index: 1;
  height: 5px;
  bottom: 2px;
  left: 0;
  border-radius: 5px;
  transition: background-color 0.5s;
  user-select: none;
}
.scroll-view{
  overflow: scroll;
  height: 100%;
  width: 100%;
}
</style>
