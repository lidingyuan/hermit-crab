<template>
  <div class="month-content">
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
import { formatYearMonth } from '../utils/dateFormatUtil'
export default {
  name: 'MonthContent',
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
      const monthMap = [
        '一月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'
      ]
      const dateList = []
      for (let index = 0; index < 12; index++) {
        const date = new Date(year, index, 1)
        dateList.push({
          date,
          dateStr: formatYearMonth(date),
          value: monthMap[index]
        })
      }
      return dateList
    }
  },
  watch: {
    checkedDate: {
      handler () {
        this.dateStr = formatYearMonth(this.checkedDate)
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
.month-content{
  display: flex;
  flex-wrap: wrap;
  .date-item{
    width: calc(100% / 4);
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
