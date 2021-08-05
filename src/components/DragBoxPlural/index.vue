<template>
  <scroll-box style="height:100%;width:100%;" @scrollChange="scrollChange">
    <div class="drag-box-base" @mousemove="mousemove($event)" @mouseup="mouseup($event)">
      <template v-for="(arr,colIndex) in value">
        <div
          class="drag-box"
          :style="{width:100/value.length+'%'}"
          :key="colIndex+'-drag-box'"
        >
          <div
            v-for="(item,index) in arr"
            :key="dragKey?item[dragKey]:item"
            :ref="(dragKey?item[dragKey]:item)+'-base'"
            class="drag-block-base"
          >
            <div
              @mousedown="mousedown($event,item,index,colIndex)"
              :ref="(dragKey?item[dragKey]:item)"
              :style="index | top(pickIndex,passNum,height,colIndex,nowColIndex,pickColIndex)"
              :class="{'drag-block--absolute':!!pickUp && pickUp !== (dragKey?item[dragKey]:item),'drag-block--pick':pickUp === (dragKey?item[dragKey]:item)}"
            >
              <slot :item="item" :index="index" :colIndex="colIndex">{{item}}</slot>
            </div>
          </div>
        </div>
        <div class="divider" :key="colIndex+'-divider'" v-if="colIndex !== value.length-1"></div>
      </template>
    </div>
  </scroll-box>
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
      scrollY: 0,
      pickUp: '',
      passNum: 0,
      pickIndex: 0,
      pickColIndex: 0,
      nowColIndex: 0,
      timeout: null,
      moveY: 0,
      moveX: 0,
      layerX: 0,
      beginY: 0,
      beginX: 0,
      scrollYBegin: 0,
      height: 0,
      width: 0
    }
  },
  computed: {
    pickUpDom () {
      return this.$refs[this.pickUp][0]
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
  created () {
    this.list = [...this.value]
    this.value.forEach((arr, i) => {
      this.list[i] = [...arr]
    })
  },
  filters: {
    top (index, pickIndex, passNum, height, colIndex, nowColIndex, pickColIndex) {
      let top = 0
      if (colIndex === nowColIndex && nowColIndex === pickColIndex) {
        if ((pickIndex + passNum) < index && index < pickIndex) {
          top = height
        }
        if ((pickIndex + passNum) > index && index > pickIndex) {
          top = -height
        }
      }
      if (colIndex === nowColIndex && nowColIndex !== pickColIndex) {
        if ((pickIndex + passNum) <= index) {
          top = height
        }
      }
      if (colIndex === pickColIndex && pickColIndex !== nowColIndex) {
        if (pickIndex < index) {
          top = -height
        }
      }

      return { top: top + 'px' }
    }

  },
  methods: {
    //
    fixBaseSize () {
      this.list.forEach((col, colIndex) => {
        col.forEach(item => {
          const ref = this.dragKey ? item[this.dragKey] : item
          this.$refs[ref + '-base'][0].style.height = this.$refs[ref][0].clientHeight + 'px'
          this.$refs[ref + '-base'][0].style.width = this.$refs[ref][0].clientWidth + 'px'
          this.$refs[ref][0].style.height = this.$refs[ref][0].clientHeight + 'px'
          this.$refs[ref][0].style.width = this.$refs[ref][0].clientWidth + 'px'
        })
      })
    },
    mousedown (event, option, index, colIndex) {
      if (this.pickUp) {
        return
      }
      this.fixBaseSize()
      this.timeout = setTimeout(() => {
        this.pickUp = this.dragKey ? option[this.dragKey] : option
        this.pickIndex = index
        this.pickColIndex = colIndex
        this.nowColIndex = colIndex
        this.beginY = event.y
        this.beginX = event.x
        this.scrollYBegin = this.scrollY
        setTimeout(() => {
          this.height = this.pickUpDom.clientHeight
          this.width = this.pickUpDom.clientWidth
        }, 0)
      }, 100)
    },
    mouseup (event) {
      clearTimeout(this.timeout)
      if (!this.pickUp) {
        return
      }
      if (this.passNum || this.pickColIndex !== this.nowColIndex) {
        const item = this.list[this.pickColIndex].splice(this.pickIndex, 1)
        let index = this.pickIndex + this.passNum
        if (this.passNum > 0) {
          if (this.pickColIndex !== this.nowColIndex) {
            index++
          }
          this.list[this.nowColIndex].splice(index, 0, item[0])
        } else {
          index++
          this.list[this.nowColIndex].splice(index, 0, item[0])
        }
        this.$emit('input', this.list)
      }
      this.beginY = 0
      this.beginX = 0
      this.passNum = 0
      this.pickUpDom.style.top = '0px'
      this.pickUpDom.style.left = '0px'

      this.pickIndex = 0
      this.pickColIndex = 0
      this.nowColIndex = 0
      this.pickUp = ''
    },
    mousemove (event) {
      if (this.pickUp) {
        this.moveY = event.y
        this.moveX = event.x
        this.layerX = event.layerX
        this.move()
      }
    },
    move () {
      this.changeCol(this.moveX - this.beginX + this.layerX, this.width)
      const moveYNum = this.moveY - this.beginY + this.scrollY - this.scrollYBegin
      const moveXNum = this.moveX - this.beginX
      this.pickUpDom.style.top = moveYNum + 'px'
      this.pickUpDom.style.left = moveXNum + 'px'
      this.passNum = moveYNum / this.height
    },
    changeCol (move, width) {
      const changeIndex = Math.floor(move / width)
      const nowColIndex = this.pickColIndex + changeIndex
      if (nowColIndex > -1 && nowColIndex < this.list.length) {
        this.nowColIndex = nowColIndex
      }
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
.drag-block-base{
    cursor: move;
    position: relative;
    width: 100%;
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
    width: 100%;
  }
  .drag-block--pick{
    position: absolute;
    z-index: 1;
    opacity: 0.5;
    width: 100%;
  }
</style>
