<template>
  <div
    ref="scroll-box"
    class="scroll-box"
  >
    <div
      ref="scroll-view"
      class="scroll-view"
      :style="viewStyle"
      @mouseenter="hover(true)"
      @mouseleave="hover(false)"
      @scroll="scroll"
    >
      <slot />
      <div
        class="bar-y"
        :style="{height:coefficientY * 100 + '%',backgroundColor: showBar.Y ? backgroundColor : '',transform: 'translate3d(0, '+barYTop+', 0)'}"
        @mousedown="beginScroll($event,'Y')"
      />
      <div
        class="bar-x"
        :style="{width:coefficientX * 100 + '%',backgroundColor: showBar.X ? backgroundColor : '',transform: 'translate3d('+barXLeft+', 0, 0)'}"
        @mousedown="beginScroll($event,'X')"
      />
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
    scrollLeft: Number
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
      boxStyle: {},
      viewStyle: {
        height: '100%',
        width: '100%'
      },

      listener: null,
      clickBegin: {
        X: 0,
        Y: 0
      },
      clientBegin: {
        X: 0,
        Y: 0
      },
      clickBarName: '',

      defaultHeight: undefined
    }
  },
  watch: {
    scrollTop (val, oldVal) {
      if (val === oldVal) {
        return
      }
      this.$refs['scroll-view'].scrollTop = val
    },
    scrollLeft (val, oldVal) {
      if (val === oldVal) {
        return
      }
      this.$refs['scroll-view'].scrollLeft = val
    }
  },
  mounted () {
    this.defaultHeight = this.$refs['scroll-view'].clientHeight
    window.addEventListener('resize', this.computeBarWidth)
    this.computeBarWidth()
  },
  beforeDestroy () {
    document.removeEventListener('mousemove', this.moveScroll)
    document.removeEventListener('mouseup', this.endScroll)
    window.removeEventListener('resize', this.computeBarWidth)
  },
  methods: {
    //
    hover (b) {
      const el = this.$refs['scroll-view']
      this.coefficientY = el.clientHeight / el.scrollHeight
      this.coefficientX = el.clientWidth / el.scrollWidth
      this.showBar.Y = false
      this.showBar.X = false
      if (this.coefficientY < 1) {
        this.showBar.Y = b
      }
      if (this.coefficientX < 1) {
        this.showBar.X = b
      }
    },
    scroll () {
      const clientHeight = this.$refs['scroll-view'].clientHeight
      const clientWidth = this.$refs['scroll-view'].clientWidth
      const scrollTop = this.$refs['scroll-view'].scrollTop
      const scrollLeft = this.$refs['scroll-view'].scrollLeft
      this.barYTop = scrollTop / clientHeight * 100 + '%'
      this.barXLeft = scrollLeft / clientWidth * 100 + '%'
      if (this.scrollTop !== scrollTop || this.scrollLeft !== scrollLeft) {
        this.$emit('scrollChange', scrollTop, scrollLeft)
      }
    },
    computeBarWidth () {
      this.viewStyle = {
        height: '100%',
        width: '100%'
      }
      this.$nextTick(() => {
        const clientWidth = this.$refs['scroll-view'].clientWidth
        const offsetWidth = this.$refs['scroll-view'].offsetWidth
        const clientHeight = this.$refs['scroll-view'].clientHeight
        const offsetHeight = this.$refs['scroll-view'].offsetHeight

        this.viewStyle = {
          height: `calc(100% + ${offsetWidth - clientWidth}px)`,
          width: `calc(100% + ${offsetHeight - clientHeight}px)`
        }
        if (!this.defaultHeight) {
          this.viewStyle['margin-bottom'] = `-${offsetHeight - clientHeight}px`
        }
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
  }
}
</script>

<style lang='scss' scoped>
.scroll-box{
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;
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
