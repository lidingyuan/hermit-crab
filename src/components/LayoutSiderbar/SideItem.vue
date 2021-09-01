<template>
  <div>
    <div
      v-transition:active="activeMenu === menu.key"
      class="layout-item"
    >
      <div
        v-transition:active="activeMenu === menu.key"
        class="layout-child-name"
        :style="{'padding-left':26*level+'px'}"
        @click="menuClick(menu)"
      >
        {{ menu.name }}
        <div
          v-transition:flip="visibleMap[menu.key]"
          class="item-expand"
        />
      </div>
    </div>
    <div
      v-if="menu.children"
      v-transition:height="visibleMap[menu.key]"
    >
      <div
        v-for="child in menu.children"
        :key="child.key"
      >
        <SideItem
          :level="level+1"
          :menu="child"
          @openPage="openPage"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideItem',
  props: {
    menu: {
      type: Object,
      default: () => { return {} }
    },
    level: {
      type: Number,
      default: 1
    },
    activeMenu: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      visibleMap: {}
    }
  },
  created () {

  },
  methods: {
    menuClick (item) {
      if (!item.children || !item.children.length) {
        this.$emit('update:activeMenu', item.key)
      } else {
        this.$set(this.visibleMap, item.key, !this.visibleMap[item.key])
      }
    },
    openPage (item) {
      this.$emit('update:activeMenu', item.key)
    }
  }
}
</script>

<style lang='scss' scoped>
@import '~@/assets/style/default.scss';
$dark-color: #021E3A;
$color: #03294E;
$font-color: #FFFFFF;
$checked-color: #003D6D;
$checked-icon-color: #3385FF;
.layout-item{
  width: 240px;
  display: flex;
  align-items: center;
  color: $font-color;
  cursor: pointer;
  border-left: transparent 4px solid;
  &.active{
    background: $checked-color;
    border-left: $checked-icon-color 4px solid;
  }
  .layout-name{
    width: 0;
    flex-grow: 1;
  }
  .layout-child-name{
    width: 0;
    height: 100%;
    min-height: 52px;
    display: flex;
    align-items: center;
    flex-grow: 1;
    padding-left: 26px;
    background: $dark-color;
    justify-content: space-between;
    &.active{
        background: #003D6D;
    }
  }
  .item-expand{
    transform: rotateZ(-90deg);
    &.flip{
      transform: rotateZ(0deg);
    }
  }
}
</style>
