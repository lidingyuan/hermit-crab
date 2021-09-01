<template>
  <div class="drag-example">
    拖拽例子，不使用draggable 可在拖拽时滚动，代价是拖拽物不能移出容器
    <DragBoxPlural
      v-model="options"
      style="width:100%;height:200px;border:1px solid #000;box-sizing:border-box;text-align:center;"
    >
      <template v-slot:default="{item}">
        <div style="width:100%;">
          {{ item }}
        </div>
      </template>
    </DragBoxPlural>
  </div>
</template>

<script>
import DragBoxPlural from '../components/DragBoxPlural'
export default {
  name: 'DragExample',
  components: { DragBoxPlural },
  data () {
    return {
      options: [['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'], [], []]
    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>

</style>
