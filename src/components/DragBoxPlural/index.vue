<template>
  <div
    style="height:100%;width:100%;"
  >
    <div
      class="drag-box-base"
      @mouseup="mouseup($event)"
      @mouseenter="mouseenterBox()"
      @mouseleave="mouseleaveBox()"
    >
      <div
        v-for="(item,itemIndex) in arr"
        :key="dragKey?item[dragKey]:item"
        :ref="boxIndex+'-'+itemIndex"
        :style="{
          'margin-top':nowBoxIndex===boxIndex && nowIndex===itemIndex?height+'px':'0',
          transition: pickIndex>-1 && !!pickBoxIndex && (pickIndex!==itemIndex || pickBoxIndex!==boxIndex)?'all 0.5s':'none',
          top:pickIndex===itemIndex && pickBoxIndex===boxIndex?top:0,
          left:pickIndex===itemIndex && pickBoxIndex===boxIndex?left:0,
          width:pickIndex===itemIndex && pickBoxIndex===boxIndex?width+'px' : '',
          height:pickIndex===itemIndex && pickBoxIndex===boxIndex?height+'px' : ''
        }"
        class="drag-block"
        :class="{'drag-block--pick':pickIndex===itemIndex && pickBoxIndex===boxIndex}"
        @mousedown="mousedown($event,itemIndex,boxIndex)"
        @mouseenter="mouseenter(itemIndex,boxIndex)"
      >
        <slot
          :item="item"
          :index="itemIndex"
        >
          {{ item }}
        </slot>
      </div>
      <div class="drag-block" :ref="boxIndex+'-'+arr.length" :style="{height:height+'px',width:width+'px'}"
        @mousedown="mousedown($event,arr.length,boxIndex)"
        @mouseenter="mouseenter(arr.length,boxIndex)"
      ></div>
    </div>
  </div>
</template>

<script>

const DataMap = new WeakMap()

export default {
  name: 'DragBoxPlural',
  props: {
    value: {
      type: [Array, Object],
      default: () => []
    },
    dragKey: {
      type: String,
      default: ''
    },
    boxIndex: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      //
      list: [],
      pickIndex: -1,
      pickBoxIndex: null,
      nowBoxIndex: -1,
      nowIndex: -1,
      timeout: null,
      moveY: 0,
      moveX: 0,
      height: null,
      width: null
    }
  },
  watch: {
    value () {
      this.list = this.boxIndex ? [...this.value[this.boxIndex]] : [...this.value]
    }
  },
  computed: {
    arr () {
      return this.boxIndex ? this.value[this.boxIndex] : this.value
    },
    top () {
      return this.moveY - (this.height / 2) + 'px'
    },
    left () {
      return this.moveX - (this.width / 2) + 'px'
    }
  },
  created () {
    this.list = this.boxIndex ? [...this.value[this.boxIndex]] : [...this.value]
  },
  methods: {
    //
    mousedown (event, index, boxIndex) {
      if (this.pickBoxIndex !== -1 && this.pickIndex !== -1) {
        return
      }
      this.timeout = setTimeout(() => {
        const pickUpDom = this.$refs[boxIndex + '-' + index][0]
        this.moveY = event.y
        this.moveX = event.x
        this.pickIndex = index
        this.pickBoxIndex = boxIndex
        this.nowBoxIndex = boxIndex

        this.height = pickUpDom.clientHeight
        this.width = pickUpDom.clientWidth
        this.setPick(index, boxIndex, this.width, this.height)
      }, 100)
      document.body.addEventListener('mouseup', this.mouseupG)
      document.body.addEventListener('mousemove', this.mousemove)
    },
    mouseenter (index, boxIndex) {
      if (!DataMap.get(this.value)) {
        return
      }
      if (boxIndex === this.nowBoxIndex) {
        this.nowIndex = index
      }
    },
    mouseenterBox () {
      if (!DataMap.get(this.value)) {
        return
      }
      const { index, boxIndex, width, height } = DataMap.get(this.value)
      this.width = width
      this.height = height
      this.pickIndex = index
      this.pickBoxIndex = boxIndex
      this.nowBoxIndex = this.boxIndex
      this.nowIndex = this.value[boxIndex].length
    },
    mouseleaveBox () {
      if (!DataMap.get(this.value)) {
        return
      }
      this.nowBoxIndex = null
    },
    mouseup () {
      clearTimeout(this.timeout)
      if (!DataMap.get(this.value)) {
        return
      }
      let updateValue = null
      if (Object.prototype.toString.call(this.value) === '[object Array]') {
        updateValue = [...this.value]
      } else {
        updateValue = { ...this.value }
      }
      const item = updateValue[this.pickBoxIndex].splice(this.pickIndex, 1)
      let nowIndex = this.nowIndex
      if (nowIndex > this.pickIndex && this.pickBoxIndex === this.nowBoxIndex) {
        nowIndex--
      }
      updateValue[this.boxIndex].splice(nowIndex, 0, item[0])
      this.$emit('input', updateValue)
      this.deletePick()
      this.pickIndex = -1
      this.pickBoxIndex = null
      this.nowBoxIndex = null
      this.nowIndex = -1
    },
    mouseupG () {
      this.deletePick()
      this.pickIndex = -1
      this.pickBoxIndex = null
      this.nowBoxIndex = null
      this.nowIndex = -1
      this.width = 0
      this.height = 0
      document.body.removeEventListener('mouseup', this.mouseupG)
      document.body.removeEventListener('mousemove', this.mousemove)
    },
    mousemove (event) {
      if (this.pickBoxIndex !== -1 && this.pickIndex !== -1) {
        this.moveY = event.y
        this.moveX = event.x
      }
    },
    setPick (index, boxIndex, width, height) {
      DataMap.set(this.value, {
        index, boxIndex, width, height
      })
    },
    deletePick () {
      DataMap.delete(this.value)
    }
  }
}
</script>

<style lang='scss' scoped>
.drag-box-base{
  display: flex;
  height: 100%;
  user-select: none;
  flex-direction: column;
}
.drag-block{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  &:hover{
    background: #F5F7FA;
  }
  .check-text{
    width: 200px;
  }
}
.drag-block--pick{
  transition: none;
  position: fixed;
  z-index: 1;
  opacity: 0.5;
  width: 100%;
  pointer-events: none;
}
</style>
