<template>
  <div class="year-content">
    <div
      v-for="(date,index) in dateList"
      :key="index"
      class="date-item"
      :class="{
        [date.type]:true,
        today:date.dateStr === dateStr
      }"
      @click="pickDate(date)"
    >
      {{ date.value }}
    </div>
  </div>
</template>

<script>
import { formatYear } from '../utils/dateFormatUtil'
export default {
  name: 'YearContent',
  props: {
    checkedDate: Date,
    contentDate: Date
  },
  data () {
    return {
      dateStr: 0
    }
  },
  computed: {
    dateList () {
      const year = this.contentDate.getFullYear()
      const dateList = []
      for (let index = year - 4; index < year + 5; index++) {
        const date = new Date(index, 0, 1)
        dateList.push({
          date,
          dateStr: formatYear(date),
          value: index + '年'
        })
      }
      return dateList
    }
  },
  watch: {
    checkedDate: {
      handler () {
        this.dateStr = formatYear(this.checkedDate)
      },
      immediate: true
    }
  },
  methods: {
    pickDate (date) {
      this.$emit('pick', date.date)
    }
  }
}
</script>

<style lang='scss' scoped>
.year-content{
  display: flex;
  flex-wrap: wrap;
  .date-item{
    width: calc(100% / 3);
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &.pre{
      color: #ccc;
    }
    &.next{
      color: #ccc;
    }
    &.today{
      color: #000;
      background: #cfc;
    }
  }
}
</style>
