<template>
  <div class="tree-example">
    <WaterMark
      :text="input"
      :opacity="0.3"
      :color="['green','blue']"
    />
    <ZlTree
      v-model="tree"
      :options="treeOptions"
    />
    {{ tree }}
    <br>
    <ZlTree
      v-model="tree"
      :options="treeOptions"
      show-checkbox
      :checked.sync="checked"
    />
    {{ checked }}
  </div>
</template>

<script>
import WaterMark from '@/components/WaterMark'
export default {
  name: 'TreeExample',
  label: '树',
  components: { WaterMark },
  data () {
    return {
      input: 'test',
      tree: 2,
      checked: [],
      treeOptions: [
        {
          label: 'test1',
          value: 1,
          children: [
            {
              label: 'test1.1',
              value: 11,
              children: [
                { label: 'test1.1.1', value: 111 }, { label: 'test1.1.2', value: 112 }
              ]
            }, { label: 'test1.2', value: 12 }
          ]
        },
        { label: 'test2', value: 2 }
      ]
    }
  },
  created () {

  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.tree-example{
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
