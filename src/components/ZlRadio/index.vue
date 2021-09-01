<template>
  <div class="zl-radio">
    <div
      v-for="(item,index) in options"
      :key="item.value"
      class="zl-radio-item"
      :class="{active:bindVal === item.value}"
      @click="clickRadio(item,index)"
    >
      <ZlCheckIcon
        :check="bindVal === item.value"
        type="circle"
      />
      <div>{{ item.label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ZlRadio',
  props: {
    value: [String, Number],
    options: Array
  },
  data () {
    return {
      bindVal: ''
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
    clickRadio (item) {
      this.bindVal = item.value
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/style/default.scss';
.zl-radio{
  display: flex;
  .zl-radio-item{
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
