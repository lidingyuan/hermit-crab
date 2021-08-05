<template>
  <div class="table-head">
    <TableHeadCell
      v-for="head in headData"
      :key="head.field"
      :style="{width:head.width+'px'}"
      :head="head"
    >
    </TableHeadCell>
  </div>
</template>

<script>
import TableHeadCell from './TableHeadCell'
export default {
  name: 'TableHead',
  components: { TableHeadCell },
  props: {
    headData: Array
  },
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
@import '~@/assets/style/default.scss';
.table-head{
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
