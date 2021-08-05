<template>
  <div class="table-head-cell">
    <TableCell>{{head.name}}</TableCell>
    <div class="table-head-row" v-if="head.children.length">
      <TableHeadCell
        v-for="head in head.children"
        :key="head.field"
        :style="{width:head.width+'px'}"
        :head="head"
      >
      </TableHeadCell>
    </div>
  </div>
</template>

<script>
import TableCell from './TableCell.vue'
export default {
  name: 'TableHeadCell',
  components: { TableCell },
  props: { head: Object },
  data () {
    return {

    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.table-head-cell{
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #999;
}
.table-head-row{
  display: flex;
  flex-grow: 1;
}
</style>
