<template>
  <scroll-box
    style="height:100%;width:100%;"
    @scrollChange="scrollChange"
  >
    <div
      @mouseup="mouseup($event)"
    >
      <div
        v-for="(item,index) in value"
        :key="dragKey?item[dragKey]:item"
        :ref="(dragKey?item[dragKey]:item)+'-base'"
        class="drag-block-base"
      >
        <div
          :ref="dragKey?item[dragKey]:item"
          :style="{top:((pickIndex+passNum)<index && index<pickIndex)?height+'px':((pickIndex+passNum)>index && index>pickIndex)?-height+'px':'0px'}"
          :class="{'drag-block--absolute':!!pickUp && pickUp !== (dragKey?item[dragKey]:item),'drag-block--pick':pickUp === (dragKey?item[dragKey]:item)}"
          @mousedown="mousedown($event,item,index)"
        >
          <slot
            :item="item"
            :index="index"
          >
            {{ item }}
          </slot>
        </div>
      </div>
    </div>
  </scroll-box>
</template>

<script>
import ScrollBox from '../ScrollBox'

export default {
  name: 'DragBox',
  components: {
    ScrollBox
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    dragKey: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      //
      list: [],
      scrollY: 0,
      pickUp: '',
      passNum: 0,
      pickIndex: 0,
      timeout: null,
      moveY: 0,
      moveX: 0,
      beginY: 0,
      beginX: 0,
      scrollYBegin: 0
    }
  },
  computed: {
    pickUpDom () {
      return this.$refs[this.pickUp][0]
    }
  },
  watch: {
    value (val) {
      this.list = [...val]
    }
  },
  created () {
    this.list = [...this.value]
  },
  methods: {
    //
    fixBaseSize () {
      this.list.forEach(item => {
        const ref = this.dragKey ? item[this.dragKey] : item
        this.$refs[ref + '-base'][0].style.height = this.$refs[ref][0].clientHeight + 'px'
        this.$refs[ref + '-base'][0].style.width = this.$refs[ref][0].clientWidth + 'px'
      })
    },
    mousedown (event, option, index) {
      if (this.pickUp) {
        return
      }
      this.fixBaseSize()
      this.timeout = setTimeout(() => {
        this.pickUp = this.dragKey ? option[this.dragKey] : option
        this.pickIndex = index
        this.height = this.pickUpDom.clientHeight
        this.beginY = event.y
        this.beginX = event.x
        this.scrollYBegin = this.scrollY
      }, 100)
    },
    mouseup (event) {
      clearTimeout(this.timeout)
      if (!this.pickUp) {
        return
      }
      if (this.passNum) {
        const item = this.list.splice(this.pickIndex, 1)
        if (this.passNum > 0) {
          this.list.splice(this.pickIndex + this.passNum, 0, item[0])
        } else {
          this.list.splice(this.pickIndex + this.passNum + 1, 0, item[0])
        }
        this.$emit('input', this.list)
      }
      this.beginY = 0
      this.beginX = 0
      this.passNum = 0
      this.pickUpDom.style.top = '0px'
      this.pickUpDom.style.left = '0px'
      this.pickUp = ''
    },
    mousemove (event) {
      if (this.pickUp) {
        this.moveY = event.y
        this.moveX = event.x
        this.move()
      }
    },
    move () {
      const moveYNum = this.moveY
      const moveXNum = this.moveX
      this.pickUpDom.style.top = moveYNum - (this.pickUpDom.clientHeight / 2) + 'px'
      this.pickUpDom.style.left = moveXNum - (this.pickUpDom.clientWidth / 2) + 'px'
      this.passNum = (moveYNum - this.beginY + this.scrollY - this.scrollYBegin) / this.height
    },
    scrollChange (x, y) {
      this.scrollY = x
      if (this.pickUp) {
        this.move()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.drag-block-base{
  cursor: move;
  position: relative;
  user-select: none;
}
  .drag-block{
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover{
      background: #F5F7FA;
    }
    .check-text{
      width: 200px;
    }
  }
  .drag-block--absolute{
    position: absolute;
    transition: top 0.5s;
  }
  .drag-block--pick{
    position: fixed;
    z-index: 1;
    opacity: 0.5;
    width: 100%;
    pointer-events: none;
  }
</style>
