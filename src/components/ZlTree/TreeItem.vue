<template>
  <div class="tree-item-box">
    <div
      class="tree-item"
      :class="{select:bindVal===option.value}"
      :style="{'padding-left': 16*level+'px'}"
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
      <span
        class="tree-label"
        @click.stop="select(option.value);change()"
      >
        <i
          v-if="showCheckbox"
          :class="[checkedNumber === collectList.length?'fa-check-square':checkedNumber === 0?'fa-square-o':'fa-minus-square']"
          class="fa tree-icon"
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
        :level="level+1"
        @check="check"
        @collect="collect"
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
    level: Number
  },
  data () {
    return {
      show: false,
      collectList: [],
      checkedNumber: 0
    }
  },
  created () {
    if (!this.option.children?.length) {
      this.collect(this.change)
    }
  },
  methods: {
    change (val) {
      let num = val
      if (!this.option.children?.length) {
        if (num === undefined) {
          num = (this.checkedNumber + 1) % 2
        }
        if (this.checkedNumber !== num) {
          this.checkedNumber = num
          this.$emit('check', this.option.value, num)
        }
      } else {
        if (this.collectList.length === this.checkedNumber) {
          num = 0
        } else {
          num = 1
        }
        this.collectList.forEach(fun => fun(num))
      }
    },
    collect (fun) {
      this.collectList.push(fun)
      this.$emit('collect', fun)
    },
    check (value, tag) {
      if (tag) {
        this.checkedNumber++
      } else {
        this.checkedNumber--
      }
      this.$emit('check', value, tag)
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/style/default.scss';
.tree-item-box{
  cursor: pointer;
  .tree-item{
    height: 28px;
    line-height: 28px;
    display: flex;
    align-items: center;
    .tree-icon{
      width: 16px;
      height: 16px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      &.fa-check-square{
        color: $base-color;
      }
      &.fa-minus-square{
        color: $base-color;
      }
    }
    .icon-rotate{
      transform: rotateZ(90deg);
    }
    &.select{
      background: #ccc;
    }
    .tree-label{
      flex-grow: 1;
    }
  }
}
</style>
