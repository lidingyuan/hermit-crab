<template>
  <div class="table-pick-cell" :style="pickStyle"></div>
</template>

<script>
export default {
  name: 'TablePickCell',
  props: {
    pickStyle: Object
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
.table-pick-cell{
  position: absolute;
  pointer-events: none;
  background: rgba($color: #ff0, $alpha: 0.5);
  border: 1px solid #ff0;
}
</style>
