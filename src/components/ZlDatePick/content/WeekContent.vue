<template>
  <div class="week-content">
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
        [date.type]:true
      }"
    >
      {{ date.value }}
    </div>
    <div class="week-box">
      <div
        v-for="(head,index) in headList"
        :key="'head'+index"
        class="date-item"
      >
        {{ head }}
      </div>
      <div class="divider" />
      <div
        v-for="index in dateList.length/7"
        :key="index"
        class="week-row"
        :class="{
          today:dateList[index*7-7].dateStr === dateStr
        }"
        @click="pickDate(dateList[index*7-1])"
      >
        <span>{{ parseInt(dateList[index*7-7].dateStr/100) }}年{{ dateList[index*7-7].dateStr%100 }}周</span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatYearWeek } from '../utils/dateFormatUtil'
export default {
  name: 'WeekContent',
  props: {
    checkedDate: Date,
    contentDate: Date,
    weekFirstDay: Number
  },
  data () {
    return {
      dateList: [],
      dateStr: 0
    }
  },
  computed: {
    headList () {
      const weekList = ['一', '二', '三', '四', '五', '六', '日']
      weekList.unshift(...weekList.splice(this.weekFirstDay - 1))
      return weekList
    }
  },
  watch: {
    checkedDate: {
      handler () {
        this.dateStr = formatYearWeek(this.checkedDate, this.weekFirstDay)
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
      const beginListLength = (beginDate.getDay() || 7) - this.weekFirstDay
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
          dateStr: formatYearWeek(date, this.weekFirstDay),
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
          dateStr: formatYearWeek(date, this.weekFirstDay),
          value: index
        })
      }
      const endListLength = 7 - (endDate.getDay() || 7) + this.weekFirstDay - 1
      for (let index = 1; index < endListLength + 1; index++) {
        const date = new Date(nextYear, nextMonth, index)
        dateList.push({
          type: 'next',
          date,
          dateStr: formatYearWeek(date, this.weekFirstDay),
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
.week-content{
  position: relative;
  display: flex;
  flex-wrap: wrap;
  .date-item{
    width: calc(100% / 7);
    display: flex;
    justify-content: center;
    align-items: center;
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
  .week-box{
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    top: 0;
    left: 0;
    .date-item{
      visibility: hidden;
    }
    .divider{
      visibility: hidden;
    }
  }
  .week-row{
    background: rgba(255,255,255,0.8);
    width: calc(100% * 5 / 7);
    margin: 0 auto;
    text-align: center;
    color: #ccc;
    cursor: pointer;
    &.today{
      color: #000;
      background: #cfc;
      border-radius: 1em;
    }
    &:not(.today) span{
      background: #fff;
    }
  }
}
</style>
