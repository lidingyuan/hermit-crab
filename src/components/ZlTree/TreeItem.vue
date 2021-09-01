<template>
  <div class="tree-item">
    <div
      v-for="item in options"
      :key="item.value"
      class="zl-checkbox-item"
      :class="{active:!!bindVal.find(i=>i===item.value)}"
      @click="click(item)"
    >
      <ZlCheckIcon
        :check="!!bindVal.find(i=>i===item.value)"
        type="square"
      />
      <div>{{ item.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeItem',
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

</style>
