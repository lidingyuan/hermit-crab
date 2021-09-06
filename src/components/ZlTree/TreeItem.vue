<template>
  <div class="tree-item-box">
    <div
      class="tree-item"
      :class="{select:bindVal===option.value}"
      @click="show = !show;select(option.value)"
    >
      <span class="tree-icon">
        <i
          v-if="option.children && option.children.length"
          v-transition:icon-rotate="show"
          class="fa fa-caret-right"
          aria-hidden="true"
        />
      </span>
      <span @click.stop="select(option.value);check(option.value)">
        <i
          v-if="showCheckbox"
          class="fa tree-icon"
          :class="[!!checkedArr.find(i=>i===option.value)?'fa-check-square':'fa-square-o']"
          aria-hidden="true"
        />
        {{ option.label }}
      </span>
    </div>
    <div
      v-if="option.children && option.children.length"
      v-transition:height="show"
      class="tree-children-box"
    >
      <TreeItem
        v-for="chil in option.children"
        :key="chil.value"
        :option="chil"
        :select="select"
        :bind-val="bindVal"
        :show-checkbox="showCheckbox"
        :checked-arr="checkedArr"
        :check="check"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TreeItem',
  props: {
    option: Object,
    select: Function,
    bindVal: [String, Number],
    showCheckbox: Boolean,
    checkedArr: Array,
    check: Function
  },
  data () {
    return {
      show: false
    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>
.tree-item-box{
  cursor: pointer;
  .tree-item{
    height: 28px;
    line-height: 28px;
    .tree-icon{
      width: 16px;
      height: 16px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
    }
    .icon-rotate{
      transform: rotateZ(90deg);
    }
    &.select{
      background: #ccc;
    }
  }
  .tree-children-box{
    margin-left: 16px;
  }
}
</style>
