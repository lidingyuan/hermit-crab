<template>
  <div class="table-head-cell">
    <TableCell
      style="flex-grow:1;"
      @click="$emit('sortData',head)"
    >
      {{ head.name }}
    </TableCell>
    <div
      v-if="head.children.length"
      class="table-head-row"
    >
      <TableHeadCell
        v-for="child in head.children"
        :key="child.field"
        :style="{width:child.width+'px'}"
        :head="child"
        @sortData="sortData"
      />
    </div>
  </div>
</template>

<script>
import TableCell from './TableCell.vue'
export default {
  name: 'TableHeadCell',
  components: { TableCell },
  props: { head: Object },
  methods: {
    sortData (head) {
      this.$emit('sortData', head)
    }
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
