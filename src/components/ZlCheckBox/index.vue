<template>
  <div class="zl-checkbox">
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
  name: 'ZlCheckBox',
  props: {
    value: Array,
    options: Array
  },
  data () {
    return {
      bindVal: []
    }
  },
  watch: {
    value: {
      handler (val) {
        this.bindVal = val
      },
      immediate: true
    },
    bindVal (val) {
      this.$emit('input', val)
    }
  },
  methods: {
    click (item) {
      const bindIndex = this.bindVal.findIndex(i => i === item.value)
      if (bindIndex !== -1) {
        this.bindVal.splice(bindIndex, 1)
      } else {
        this.bindVal.push(item.value)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/style/default.scss';
.zl-checkbox{
  display: flex;
  .zl-checkbox-item{
    display: flex;
    cursor: pointer;
    justify-content: space-between;
    align-items: center;
    margin-right: 32px;
    height: 28px;
    line-height: 28px;
    &.active{
      color: $base-color;
    }
  }
}
</style>
