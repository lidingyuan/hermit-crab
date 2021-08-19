<template>
  <div ref="table-cell" class="table-cell" v-active>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'TableCell',
  data () {
    return {
    }
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.table-cell{
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background:linear-gradient(#ccc,#ccc) no-repeat,linear-gradient(#ccc,#ccc) no-repeat;
  background-size:100% 1px,1px 100%;
  background-position:0 100%,100% 0;
  user-select: none;
}
</style>
