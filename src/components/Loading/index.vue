<template>
  <div class="loading">
    <div
      class="pie-slice"
      v-for="(item,index) in itemList"
      :key="index"
      :style="style(item,index,itemList.length)"
    >
      <div class="item" :style="itemStyle(item,index,itemList.length)"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    itemList: {
      type: Array,
      default: () => ['red', 'green', 'yellow', 'red', 'green', 'yellow', 'red', 'green', 'yellow', 'red', 'green', 'yellow', 'red', 'green', 'yellow', 'red', 'green', 'yellow', 'red', 'green', 'yellow', 'red', 'green', 'yellow']
    }
  },
  data () {
    return {
      //
    }
  },
  created () {
    //
  },
  methods: {
    //
    style (item, index, length) {
      return {
        transform: 'rotate(' + index / length * 360 + 'deg)',
        'z-index': index + 1
      }
    },
    itemStyle (item, index, length) {
      return {
        background: item,
        'animation-duration': 1000 + 'ms',
        'animation-delay': index / length * 1000 + 'ms'
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.loading{
  position: relative;
  width: 100px;
  height: 100px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  .pie-slice{
    width: 20px;
    height: 40px;
    margin-bottom: 40px;
    position: absolute;
    transform-origin: bottom;
    .item{
      width: 20px;
      height: 20px;
      border-radius: 20px;
      animation: fade infinite;
    }
  }
}
@keyframes fade {
    from {
        opacity: 1.0;
    }
    50% {
        opacity: 0;
    }
    to {
        opacity: 1.0;
    }
}
</style>
