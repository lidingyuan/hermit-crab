<template>
  <div class="zl-date-pick">
    <date-head
      :content-date="contentDate"
      :content-type="contentType"
      @changeContentDate="changeContentDate"
      @changeContentType="changeContentType"
    />
    <date-content
      v-if="contentType === 'date'"
      class="date-pick-content"
      :checked-date="date"
      :content-date="contentDate"
      @pick="pick"
    />
    <week-content
      v-if="contentType === 'week'"
      class="date-pick-content"
      :checked-date="date"
      :content-date="contentDate"
      :week-first-day="weekFirstDay"
      @pick="pick"
    />
    <month-content
      v-if="contentType === 'month'"
      class="date-pick-content"
      :checked-date="date"
      :content-date="contentDate"
      @pick="pick"
    />
    <year-content
      v-if="contentType === 'year'"
      class="date-pick-content"
      :checked-date="date"
      :content-date="contentDate"
      @pick="pick"
    />
  </div>
</template>

<script>
import DateHead from './DateHead.vue'
import DateContent from './content/DateContent.vue'
import WeekContent from './content/WeekContent.vue'
import MonthContent from './content/MonthContent.vue'
import YearContent from './content/YearContent.vue'
import * as formatUtil from './utils/dateFormatUtil'
export default {
  name: 'ZlDatePick',
  components: { DateHead, DateContent, WeekContent, MonthContent, YearContent },
  props: {
    value: {
      type: Date,
      default: () => new Date()
    },
    type: {
      type: String,
      default: 'date'
    },
    // [1-7] 周一到周日
    weekFirstDay: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      date: null,
      contentType: '',
      contentDate: null
    }
  },
  watch: {
    type: {
      handler () {
        this.contentType = this.type
      },
      immediate: true
    },
    value: {
      handler () {
        this.date = new Date(this.value)
        this.contentDate = new Date(this.value)
      },
      immediate: true
    }
  },
  methods: {
    changeContentDate (num) {
      // 防止31号-1个月变1号
      this.contentDate.setDate(1)
      this.contentDate.setMonth(this.contentDate.getMonth() + num)
      this.contentDate = new Date(this.contentDate)
    },
    changeContentType (contentType) {
      this.contentType = contentType
    },
    pick (date) {
      if (this.contentType === this.type) {
        this.$emit('input', date)
      } else {
        const nextMap = {
          year: 'month',
          month: this.type
        }
        this.contentDate = date
        this.contentType = nextMap[this.contentType]
      }
    },
    format (type, date) {
      const typeMap = {
        date: formatUtil.formatDate,
        week: formatUtil.formatYearWeek,
        month: formatUtil.formatYearMonth,
        year: formatUtil.formatYear
      }
      return typeMap[type](date)
    }
  }
}
</script>

<style lang='scss' scoped>
.zl-date-pick{
  overflow: hidden;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  user-select: none;
  .date-pick-content{
    height: 10.5em;
    margin-bottom: 1em;
  }
}
</style>
