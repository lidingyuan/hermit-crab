<template>
  <div class="query-example">
    <ZlQueryParam
      v-model="input"
      type="input"
      label="input"
    />
    {{ input }}
    <br>
    <ZlQueryParam
      v-model="radio"
      type="radio"
      label="radio"
      :options="options"
    />
    {{ radio }}
    <br>
    <ZlQueryParam
      v-model="checkBox"
      type="checkBox"
      label="checkBox"
      :options="options"
    />
    {{ checkBox }}
    <br>
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
    {{ tree }}
  </div>
</template>

<script>
export default {
  name: 'QueryExample',
  data () {
    return {
      input: '',
      radio: '',
      checkBox: [],
      options: [{ label: 'test1', value: 1 }, { label: 'test2', value: 2 }],
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
.query-example{
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
