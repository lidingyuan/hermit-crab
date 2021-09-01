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
      options: [{ label: 'test1', value: 1 }, { label: 'test2', value: 2 }]
    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>

</style>
