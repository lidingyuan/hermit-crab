<template>
  <div class="drag-example">
    拖拽例子，不使用draggable 可在拖拽时滚动。
    下一步：增加横向列表
    <ScrollBox style="width:100%;height:200px;border:1px solid #000;border-box;">
      <DragBoxPlural
        v-model="options"
        box-index="a"
        style="width:100%;height:200px;text-align:center;"
      >
        <template v-slot:default="{item}">
          <div style="width:100%;">
            {{ item }}
          </div>
        </template>
      </DragBoxPlural>
    </ScrollBox>
    <ScrollBox style="width:100%;height:200px;border:1px solid #000;border-box;margin-top:10vh;">
      <DragBoxPlural
        v-model="options"
        box-index="b"
        style="width:100%;height:200px;text-align:center;"
      >
        <template v-slot:default="{item}">
          <div style="width:100%;">
            {{ item }}
          </div>
        </template>
      </DragBoxPlural>
    </ScrollBox>
  </div>
</template>

<script>
import DragBoxPlural from '../components/DragBoxPlural'
import ScrollBox from '../components/ScrollBox'
export default {
  name: 'DragExample',
  label: '拖拽',
  components: { DragBoxPlural, ScrollBox },
  data () {
    return {
      options: {
        a: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n'],
        b: []
      }
    }
  },
  created () {
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.drag-example{
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
