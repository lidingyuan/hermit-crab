<template>
  <div id="app">
    <LayoutSiderbar
      :menu-list="menuList"
      :active-menu.sync="show"
    />
    <div class="content">
      <DragExample v-if="show === 'DragExample'" />
      <TableExample v-if="show === 'TableExample'" />
      <QueryExample v-if="show === 'QueryExample'" />
    </div>
  </div>
</template>

<script>
import DragExample from './example/DragExample.vue'
import TableExample from './example/TableExample.vue'
import QueryExample from './example/QueryExample.vue'
import LayoutSiderbar from './components/LayoutSiderbar'
export default {
  name: 'App',
  components: { DragExample, TableExample, QueryExample, LayoutSiderbar },
  data () {
    return {
      show: 'TableExample',
      menuList: [
        { name: '拖拽', key: 'DragExample' },
        { name: '表格', key: 'TableExample' },
        { name: '查询条件', key: 'QueryExample' }
      ]
    }
  }
}
</script>

<style>
body{
  margin: 0;
}
#app{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  box-sizing: border-box;
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
