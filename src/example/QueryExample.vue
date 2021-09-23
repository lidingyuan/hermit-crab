<template>
  <div class="query-example">
    <WaterMark
      :text="input"
      :opacity="0.3"
      :color="['green','blue']"
    />
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
import WaterMark from '@/components/WaterMark'
export default {
  name: 'QueryExample',
  label: '查询条件',
  components: { WaterMark },
  data () {
    return {
      input: 'test',
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
.query-example{
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
