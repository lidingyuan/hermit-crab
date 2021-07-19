<template>
  <div id="app">
    <ScrollBox style="height:200px;width:200px;">
      <div style="height:2000px;width:2000px;">
        <div style="height:200px;width:200px;background:red;"></div>
      </div>
    </ScrollBox>
    <DragBoxPlural v-model="options" style="width:200px;height:200px;border:1px solid #000;">
      <template v-slot:default="{item}">
        <div style="width:100%;">{{item}}</div>
      </template>
    </DragBoxPlural>
    <TestButton @click="active = !active">123</TestButton>
    <div class="test" v-transition:active.show="active">
    </div>
  </div>
</template>

<script>
import ScrollBox from './components/ScrollBox'
import DragBoxPlural from './components/DragBoxPlural'
import TestButton from './components/Button'
export default {
  name: 'App',
  components: { ScrollBox, DragBoxPlural, TestButton },
  data () {
    return {
      options: [['a', 'b', 'c'], [], []],
      active: false
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.test{
  width:100px;height:200px;
  background: transparent;
}
.test.active{
  width: 200px;
  background:#ccc;
}
</style>
