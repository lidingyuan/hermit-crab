<template>
  <div
    class="drag-transfer"
    @mouseup="mouseup()"
    @mouseenter="mouseenterBox()"
    @mouseleave="mouseleaveBox()"
  >
    <div
      v-for="(item,itemIndex) in arr"
      :key="itemIndex"
      :ref="boxIndex+'-'+itemIndex"
      :style="{
        // 未选中item样式
        'margin-top':nowBoxIndex===boxIndex && nowIndex===itemIndex?blockHeight+'px':'0',
        transition: pickIndex>-1 && pickBoxIndex !==null && (pickIndex!==itemIndex || pickBoxIndex!==boxIndex)?'all 0.5s linear':'none',
        // 选中item样式
        top:pickIndex===itemIndex && pickBoxIndex===boxIndex?top:0,
        left:pickIndex===itemIndex && pickBoxIndex===boxIndex?left:0,
        width:pickIndex===itemIndex && pickBoxIndex===boxIndex?blockWidth+'px' : '',
        height:pickIndex===itemIndex && pickBoxIndex===boxIndex?blockHeight+'px' : ''
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
    <div
      :ref="boxIndex+'-'+arr.length"
      class="drag-block"
      :style="{height:blockHeight+'px',width:blockWidth+'px'}"
      @mousedown="mousedown($event,arr.length,boxIndex)"
      @mouseenter="mouseenter(arr.length,boxIndex)"
    />
  </div>
</template>

<script>

const DataMap = new WeakMap()

export default {
  name: 'DragTransfer',
  props: {
    // 当前容器组的数据，同一组容器必须传同一个对象或数组 例：[[item],[item]] | {a:[item].b:[item]}
    value: {
      type: [Array, Object],
      default: () => []
    },
    // 当前容器的id 数组的序号，对象的属性，例：'0'|'a',传入值为null undefind '' 时为单容器模式，value应传入一维数组
    boxIndex: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // value深拷贝的数据
      total: null,
      // 当前拖拽容器的数据
      list: [],
      // 选中项本身的index
      pickIndex: -1,
      // 选中项本身的boxindex
      pickBoxIndex: null,
      // 选中项当前的index
      nowIndex: -1,
      // 选中项当前的boxindex
      nowBoxIndex: null,
      // 缓存timeoutid
      timeout: null,
      // 鼠标移动位置
      moveY: 0,
      // 鼠标移动位置
      moveX: 0,
      // 选中项高
      blockHeight: null,
      // 选中项宽
      blockWidth: null
    }
  },
  computed: {
    arr () {
      return this.total[this.boxIndex]
    },
    top () {
      return this.moveY - (this.blockHeight / 2) + 'px'
    },
    left () {
      return this.moveX - (this.blockWidth / 2) + 'px'
    }
  },
  watch: {
    value: {
      handler () {
        this.total = this.boxIndex ? this.value : { [this.boxIndex]: this.value }
        this.list = this.total[this.boxIndex]
      },
      immediate: true
    }
  },
  methods: {
    //
    mousedown (event, index, boxIndex) {
      if (this.pickBoxIndex !== null && this.pickIndex !== -1) {
        return
      }
      this.timeout = setTimeout(() => {
        const pickUpDom = this.$refs[boxIndex + '-' + index][0]
        this.moveY = event.y
        this.moveX = event.x
        this.pickIndex = index
        this.pickBoxIndex = boxIndex
        this.nowBoxIndex = boxIndex

        this.blockHeight = pickUpDom.clientHeight
        this.blockWidth = pickUpDom.clientWidth
        this.setPick(index, boxIndex, this.blockWidth, this.blockHeight)
      }, 200)
      document.body.addEventListener('mouseup', this.mouseupGlobal)
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
      const { index, boxIndex, blockWidth, blockHeight } = DataMap.get(this.value)
      this.blockWidth = blockWidth
      this.blockHeight = blockHeight
      this.pickIndex = index
      this.pickBoxIndex = boxIndex
      this.nowBoxIndex = this.boxIndex
      this.nowIndex = this.total[boxIndex].length
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

      let total
      if (Object.prototype.toString.call(this.total) === '[object Array]') {
        total = [...this.total]
      } else {
        total = { ...this.total }
      }
      total[this.pickBoxIndex] = [...total[this.pickBoxIndex]]
      total[this.boxIndex] = [...total[this.boxIndex]]
      const item = total[this.pickBoxIndex].splice(this.pickIndex, 1)
      let nowIndex = this.nowIndex
      if (nowIndex > this.pickIndex && this.pickBoxIndex === this.nowBoxIndex) {
        nowIndex--
      }
      total[this.boxIndex].splice(nowIndex, 0, item[0])
      this.$emit('input', this.boxIndex ? total : total[this.boxIndex])
    },
    mouseupGlobal () {
      this.deletePick()
      this.pickIndex = -1
      this.pickBoxIndex = null
      this.nowBoxIndex = null
      this.nowIndex = -1
      this.blockWidth = 0
      this.blockHeight = 0
      document.body.removeEventListener('mouseup', this.mouseupGlobal)
      document.body.removeEventListener('mousemove', this.mousemove)
    },
    mousemove (event) {
      if (this.pickBoxIndex !== -1 && this.pickIndex !== -1) {
        this.moveY = event.y
        this.moveX = event.x
      }
    },
    setPick (index, boxIndex, blockWidth, blockHeight) {
      DataMap.set(this.value, {
        index, boxIndex, blockWidth, blockHeight
      })
    },
    deletePick () {
      DataMap.delete(this.value)
    }
  }
}
</script>

<style lang='scss' scoped>
.drag-transfer{
  display: flex;
  height: 100%;
  width: 100%;
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
