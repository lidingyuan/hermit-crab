<template>
  <div class="date-content">
    <div
      v-for="(head,index) in headList"
      :key="'head'+index"
      class="date-item"
    >
      {{ head }}
    </div>
    <div class="divider" />
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
import { formatDate } from '../utils/dateFormatUtil'
export default {
  name: 'DateContent',
  props: {
    checkedDate: Date,
    contentDate: Date
  },
  data () {
    return {
      dateList: [],
      dateStr: ''
    }
  },
  computed: {
    headList () {
      return ['一', '二', '三', '四', '五', '六', '日']
    }
  },
  watch: {
    checkedDate: {
      handler () {
        this.dateStr = formatDate(this.checkedDate)
      },
      immediate: true
    },
    contentDate: {
      handler () {
        this.getDateCalendar(this.contentDate)
      },
      immediate: true
    }
  },
  methods: {
    getDateCalendar (date) {
      this.dateList = this.getDateList(date)
    },
    getDateList (date) {
      const dateList = []
      const year = date.getFullYear()
      const month = date.getMonth()
      const beginDate = new Date(date)
      beginDate.setDate(1)
      const beginListLength = (beginDate.getDay() || 7) - 1
      beginDate.setDate(0)
      const endNumber = beginDate.getDate()
      const preYear = beginDate.getFullYear()
      const preMonth = beginDate.getMonth()
      for (let index = 1; index < beginListLength + 1; index++) {
        const value = endNumber + index - beginListLength
        const date = new Date(preYear, preMonth, value)
        dateList.push({
          type: 'pre',
          date,
          dateStr: formatDate(date),
          value
        })
      }
      const endDate = new Date(date)
      endDate.setDate(1)
      endDate.setMonth(endDate.getMonth() + 1)
      const nextYear = endDate.getFullYear()
      const nextMonth = endDate.getMonth()
      endDate.setDate(0)
      for (let index = 1; index < endDate.getDate() + 1; index++) {
        const date = new Date(year, month, index)
        dateList.push({
          type: 'normal',
          date,
          dateStr: formatDate(date),
          value: index
        })
      }
      const endListLength = 7 - (endDate.getDay() || 7)
      for (let index = 1; index < endListLength + 1; index++) {
        const date = new Date(nextYear, nextMonth, index)
        dateList.push({
          type: 'next',
          date,
          dateStr: formatDate(date),
          value: index
        })
      }
      return dateList
    },
    pickDate (date) {
      this.$emit('pick', date.date)
    }
  }
}
</script>

<style lang='scss' scoped>
.date-content{
  display: flex;
  flex-wrap: wrap;
  .date-item{
    width: calc(100% / 7);
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
  .divider{
    width: 100%;
    margin: 0 1em;
    height: 1px;
    background: #ccc;
  }
}
</style>
