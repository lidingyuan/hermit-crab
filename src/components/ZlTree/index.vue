<template>
  <div class="zl-tree">
    <TreeItem
      v-for="option in options"
      :key="option.value"
      :option="option"
      :select="select"
      :bind-val="bindVal"
      :show-checkbox="showCheckbox"
      :checked-arr="checkedArr"
      :level="0"
      @check="check"
    />
  </div>
</template>

<script>
import TreeItem from './TreeItem.vue'
export default {
  name: 'ZlTree',
  components: { TreeItem },
  props: {
    options: Array,
    value: [String, Number],
    checked: Array,
    showCheckbox: Boolean
  },
  data () {
    return {
      bindVal: '',
      checkedArr: []
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
    },
    checked: {
      handler (val) {
        this.checkedArr = val
      },
      immediate: true
    },
    checkedArr (val) {
      this.$emit('update:checked', val)
    }
  },
  methods: {
    select (value) {
      this.bindVal = value
    },
    check (value) {
      if (!this.checked) {
        return
      }
      const index = this.checkedArr.findIndex(i => i === value)
      if (index === -1) {
        this.checkedArr.push(value)
      } else {
        this.checkedArr.splice(index, 1)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.zl-tree{
  padding: 16px;
}
</style>
