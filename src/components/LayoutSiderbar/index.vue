<template>
  <div
    v-transition:active="active"
    class="layout-siderbar"
    @transitionend="transitionend"
  >
    <div class="item-list">
      <div
        v-for="menu in menuList"
        :key="menu.key"
      >
        <div
          v-transition:active="menu.key === activeMenu"
          class="layout-item"
          @click="menuClick(menu)"
        >
          <div class="layout-name">
            {{ menu.name }}
          </div>
          <div
            v-transition:flip="visibleMap[menu.key]"
            class="item-expand"
          />
        </div>
        <div
          v-if="menu.children"
          v-transition:height="visibleMap[menu.key]"
        >
          <div
            v-for="child in menu.children"
            :key="child.key"
            v-transition:active="activeMenu === child.key"
          >
            <SideItem
              :menu="child"
              :active-menu="activeMenu"
              @openPage="openPage"
            />
          </div>
        </div>
      </div>
    </div>
    <div
      class="siderbar-switch"
      @click="siderbarSwitch()"
    >
      <div v-transition:flip="active" />
    </div>
  </div>
</template>

<script>
import SideItem from './SideItem'
export default {
  name: 'LayoutSiderbar',
  components: { SideItem },
  props: {
    menuList: Array,
    activeMenu: String
  },
  data () {
    return {
      active: true,
      visibleMap: {}
    }
  },
  methods: {
    menuClick (item) {
      this.siderbarSwitch(true)
      if (!item.children || !item.children.length) {
        this.$emit('update:activeMenu', item.key)
      } else {
        this.$set(this.visibleMap, item.key, !this.visibleMap[item.key])
      }
    },
    openPage (item) {
      this.$emit('update:activeMenu', item.key)
    },
    siderbarSwitch (target) {
      if (target === undefined) {
        this.active = !this.active
      } else {
        this.active = !!target
      }
    }
  },
  debounces: {
    transitionend (finish) {
      const resizeEvent = new Event('resize')
      window.dispatchEvent(resizeEvent)
      finish(300)
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
.layout-siderbar{
  height: 100%;
  width: 52px;
  background: $color;
  display: flex;
  flex-direction: column;
  &.active{
    width: 240px;
  }
  .item-list{
    height: 0;
    flex-grow: 1;
    overflow-x: hidden;
    .layout-item{
      width: 240px;
      height: 52px;
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
      .item-expand{
        transform: rotateZ(-90deg);
        &.flip{
          transform: rotateZ(0deg);
        }
      }
    }
  }
  .siderbar-switch{
    cursor: pointer;
    height: 52px;
    background: $dark-color;
    display: flex;
    justify-content: center;
    align-items: center;
    .flip{
      transform: rotateY(180deg);
    }
  }
}
</style>
