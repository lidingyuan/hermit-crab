<template>
  <div id="app">
    <div class="sider">
      <div @click="show = 'DragExample'">拖拽</div>
      <div @click="show = 'TableExample'">表格</div>
    </div>
    <div class="content">
      <DragExample v-if="show === 'DragExample'" />
      <TableExample v-if="show === 'TableExample'" />
    </div>
  </div>
</template>

<script>
import DragExample from './example/DragExample.vue'
import TableExample from './example/TableExample.vue'
export default {
  name: 'App',
  components: { DragExample, TableExample },
  data () {
    return {
      show: 'TableExample'
    }
  }
}
</script>

<style>
#app{
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
}
.sider{
  width: 200px;
  flex-shrink: 0;
}
.content{
  width: 0;
  flex-grow: 1;
}
</style>
