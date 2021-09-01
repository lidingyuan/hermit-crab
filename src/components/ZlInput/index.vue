<template>
  <div
    class="zl-input"
    :class="{hover:focus}"
  >
    <input
      v-model="text"
      @focus="focus=true"
      @blur="focus=false"
    >
  </div>
</template>

<script>
export default {
  name: 'ZlInput',
  props: {
    value: [String, Number]
  },
  data () {
    return {
      text: '',
      focus: false
    }
  },
  watch: {
    value: {
      handler (val) {
        this.text = val
      },
      immediate: true
    },
    text (val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/style/default.scss';
.zl-input{
  height: 28px;
  border: 1px solid $query-border-color;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  background: #FFF;
  box-sizing: border-box;
  &.hover{
    border: 1px solid $query-border-active-color;
    box-shadow: 0 0 2px $query-border-active-color;
  }
  input{
    border: none;
    outline: none;
    background: transparent;
  }
}
</style>
