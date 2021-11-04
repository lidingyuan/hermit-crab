<template>
  <div class="search-example">
    123
  </div>
</template>

<script>
import CrabSearch from '@/utils/CrabSearch'
export default {
  name: 'SearchExample',
  label: '查询',
  data () {
    return {

    }
  },
  created () {
    // const data = [
    //   { a: '各个苹果控昂科' },
    //   { a: '保工街怕噶而过【阿尔卡嘎' }
    // ]
    const data = new Array(100000).fill({ a: '保工街怕噶而过【阿尔123123卡嘎' })
    console.log(Date.now())
    const crabSearch = new CrabSearch(data, ['a'])
    console.log(Date.now())
    window.crabSearch = crabSearch
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>

</style>
