<template>
  <div
    style="height:100%;width:100%;"
  >
    <div
      class="drag-box-base"
      @mouseup="mouseup($event)"
    >
      <template v-for="(arr,colIndex) in value">
        <scroll-box
          :key="colIndex+'-drag-box'"
          class="drag-box"
          :style="{width:100/value.length+'%'}"
          @mouseenter.native="mouseenterCol(colIndex)"
        >
          <div
            v-for="(item,index) in arr"
            :key="dragKey?item[dragKey]:item"
            :ref="colIndex+'-'+index"
            :style="{
              'margin-top':nowColIndex===colIndex && nowIndex===index?height+'px':'0',
              transition: pickIndex>-1 && pickColIndex>-1 && (pickIndex!==index || pickColIndex!==colIndex)?'all 0.5s':'none',
              top:pickIndex===index && pickColIndex===colIndex?top:0,
              left:pickIndex===index && pickColIndex===colIndex?left:0,
              width:pickIndex===index && pickColIndex===colIndex?width+'px' : '',
              height:pickIndex===index && pickColIndex===colIndex?height+'px' : ''
            }"
            class="drag-block"
            :class="{'drag-block--pick':pickIndex===index && pickColIndex===colIndex}"
            @mousedown="mousedown($event,index,colIndex)"
            @mouseenter="mouseenter(index,colIndex)"
          >
            <slot
              :item="item"
              :index="index"
              :colIndex="colIndex"
            >
              {{ item }}
            </slot>
          </div>
        </scroll-box>
        <div
          v-if="colIndex !== value.length-1"
          :key="colIndex+'-divider'"
          class="divider"
        />
      </template>
    </div>
  </div>
</template>

<script>
import ScrollBox from '../ScrollBox'

export default {
  name: 'DragBoxPlural',
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
      pickIndex: -1,
      pickColIndex: -1,
      nowColIndex: -1,
      nowIndex: -1,
      timeout: null,
      moveY: 0,
      moveX: 0,
      height: null,
      width: null,
      pickUpDom: null
    }
  },
  watch: {
    value: {
      deep: true,
      handler: function (val) {
        this.list = []
        val.forEach((arr, i) => {
          this.list[i] = [...arr]
        })
      }
    }
  },
  computed: {
    top () {
      return this.moveY - (this.height / 2) + 'px'
    },
    left () {
      return this.moveX - (this.width / 2) + 'px'
    }
  },
  created () {
    this.list = [...this.value]
    this.value.forEach((arr, i) => {
      this.list[i] = [...arr]
    })
  },
  methods: {
    //
    mousedown (event, index, colIndex) {
      if (this.pickColIndex !== -1 && this.pickIndex !== -1) {
        return
      }
      this.timeout = setTimeout(() => {
        this.pickUpDom = this.$refs[colIndex + '-' + index][0]
        this.moveY = event.y
        this.moveX = event.x
        this.pickIndex = index
        this.pickColIndex = colIndex
        this.nowColIndex = colIndex

        this.height = this.pickUpDom.clientHeight
        this.width = this.pickUpDom.clientWidth
      }, 100)
      document.body.addEventListener('mousemove', this.mousemove)
    },
    mouseenter (index, colIndex) {
      if (this.pickColIndex === -1 || this.pickIndex === -1) {
        return
      }
      if (colIndex === this.nowColIndex) {
        this.nowIndex = index
      }
    },
    mouseenterCol (colIndex) {
      if (this.pickColIndex === -1 || this.pickIndex === -1) {
        return
      }
      this.nowColIndex = colIndex
      this.nowIndex = this.list[colIndex].length
    },
    mouseup () {
      clearTimeout(this.timeout)
      if (this.pickColIndex === -1 || this.pickIndex === -1) {
        return
      }
      const item = this.list[this.pickColIndex].splice(this.pickIndex, 1)
      let nowIndex = this.nowIndex
      if (nowIndex > this.pickIndex && this.pickColIndex === this.nowColIndex) {
        nowIndex--
      }
      this.list[this.nowColIndex].splice(nowIndex, 0, item[0])
      this.$emit('input', this.list)

      this.pickIndex = -1
      this.pickColIndex = -1
      this.nowColIndex = -1
      this.nowIndex = -1
      this.pickUpDom = null
      document.body.removeEventListener('mousemove', this.mousemove)
    },
    mousemove (event) {
      if (this.pickColIndex !== -1 && this.pickIndex !== -1) {
        this.moveY = event.y
        this.moveX = event.x
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.drag-box-base{
  display: flex;
  height: 100%;
  user-select: none;
  .divider{
    width: 1px;
    margin: 5px 0;
    background: #F5F7FA;
  }
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
.drag-block--pick{
  transition: none;
  position: fixed;
  z-index: 1;
  opacity: 0.5;
  width: 100%;
  pointer-events: none;
}
</style>
