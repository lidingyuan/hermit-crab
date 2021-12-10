<template>
  <div>
    <ZlDatePick
      v-model="date"
      type="date"
      style="width:45%;display:inline-block;"
      class="date-pick"
    />
    <ZlDatePick
      v-model="date"
      type="week"
      style="width:45%;display:inline-block;"
      class="date-pick"
    />
    <ZlDatePick
      v-model="date"
      type="month"
      style="width:45%;display:inline-block;"
      class="date-pick"
    />
    <ZlDatePick
      v-model="date"
      type="year"
      style="width:45%;display:inline-block;"
      class="date-pick"
    />
  </div>
</template>

<script>
export default {
  name: 'DatePickExample',
  label: '日期选择',
  data () {
    return {
      date: null
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
