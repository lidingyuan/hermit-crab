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
          class="caret"
        />
      </span>
      <span
        class="tree-label"
        @click.stop="select(option.value);change()"
      >
        <ZlCheckIcon
          v-if="showCheckbox"
          :check="checkedNumber != 0"
          :type="(checkedNumber === collectList.length || checkedNumber === 0)?'square':'square half'"
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
      width: 1em;
      height: 1em;
      margin-right: 0.5em;
      display: inline-flex;
    }
    .caret{
      width: 1em;
      height: 1em;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      position: relative;
      &::after{
        transition: all 0.3s;
        border-right: 0.2em solid #333;
        border-bottom: 0.2em solid #333;
        border-top: 0.2em solid transparent;
        border-left: 0.2em solid transparent;
        position: absolute;
        content: '';
        width: 0em;
        height: 0em;
        margin-top: 0em;
        margin-left: 0em;
        transform: rotate(-45deg);
      }
    }
    .icon-rotate{
      &::after{
        margin-top: -0.2em;
        margin-left: 0.2em;
        transform: rotate(45deg);
      }
    }
    &.select{
      background: #ddd;
    }
    .tree-label{
      flex-grow: 1;
      display: flex;
      align-items: center;
    }
  }
}
</style>
