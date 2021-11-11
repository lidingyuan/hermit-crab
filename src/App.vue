<template>
  <div id="app">
    <LayoutSiderbar
      :menu-list="menuList"
      :active-menu.sync="show"
    />
    <div class="content">
      <component :is="show" />
    </div>
  </div>
</template>

<script>
import LayoutSiderbar from './components/LayoutSiderbar'
const files = require.context('@/example', true, /^((?!components).)+\.vue$/, 'sync')
const components = {}
files.keys().forEach(key => {
  const component = files(key).default || files(key)
  components[component.name] = component
})
export default {
  name: 'App',
  components: { LayoutSiderbar, ...components },
  data () {
    return {
      show: 'DragExample',
      menuList: Object.values(components).map(comp => {
        return {
          name: comp.label,
          key: comp.name
        }
      })
    }
  }
}
</script>

<style>
body{
  margin: 0;
}
#app{
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  display: flex;
  box-sizing: border-box;
}
.sider{
  width: 200px;
  flex-shrink: 0;
}
.content{
  width: 0;
  flex-grow: 1;
  position: relative;
}
</style>
