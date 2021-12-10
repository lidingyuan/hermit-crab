<template>
  <div class="date-pick-head">
    <div
      class="date-pick-head-btn"
      @click="typeMap[contentType].preMore()"
    >
      «
    </div>
    <div
      class="date-pick-head-btn"
      @click="typeMap[contentType].pre()"
    >
      <template v-if="!!typeMap[contentType].pre">
        ‹
      </template>
    </div>
    <div class="date-pick-head-title">
      <div
        v-if="!!typeMap[contentType].year"
        @click="typeMap[contentType].year()"
      >
        {{ year }}年
      </div>
      <div
        v-if="!!typeMap[contentType].month"
        @click="typeMap[contentType].month()"
      >
        {{ month }}月
      </div>
    </div>
    <div
      class="date-pick-head-btn"
      @click="typeMap[contentType].next()"
    >
      <template v-if="!!typeMap[contentType].next">
        ›
      </template>
    </div>
    <div
      class="date-pick-head-btn"
      @click="typeMap[contentType].nextMore()"
    >
      »
    </div>
  </div>
</template>

<script>
export default {
  name: 'DatePickHead',
  props: {
    contentDate: Date,
    contentType: String
  },
  data () {
    return {
      typeMap: {
        date: {
          preMore: this.subYear,
          pre: this.subMonth,
          next: this.addMonth,
          nextMore: this.addYear,
          month: this.changeToMonth,
          year: this.changeToYear
        },
        week: {
          preMore: this.subYear,
          pre: this.subMonth,
          next: this.addMonth,
          nextMore: this.addYear,
          month: this.changeToMonth,
          year: this.changeToYear
        },
        month: {
          preMore: this.subYear,
          nextMore: this.addYear,
          year: this.changeToYear
        },
        year: {
          preMore: this.subYearMore,
          nextMore: this.addYearMore
        }
      }
    }
  },
  computed: {

    year () {
      return this.contentDate.getFullYear()
    },
    month () {
      return this.contentDate.getMonth() + 1
    }
  },
  created () {

  },
  methods: {
    subYear () {
      this.$emit('changeContentDate', -12)
    },
    addYear () {
      this.$emit('changeContentDate', 12)
    },
    subMonth () {
      this.$emit('changeContentDate', -1)
    },
    addMonth () {
      this.$emit('changeContentDate', 1)
    },
    subYearMore () {
      this.$emit('changeContentDate', -108)
    },
    addYearMore () {
      this.$emit('changeContentDate', 108)
    },
    changeToMonth () {
      this.$emit('changeContentType', 'month')
    },
    changeToYear () {
      this.$emit('changeContentType', 'year')
    }
  }
}
</script>

<style lang='scss' scoped>
.date-pick-head{
  display: flex;
  height: 3em;
  >div{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .date-pick-head-btn{
    cursor: pointer;
    width: 1.5em;
  }
  .date-pick-head-title{
    width: 0;
    flex-grow: 1;
    justify-content: space-around;
    >div{
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
